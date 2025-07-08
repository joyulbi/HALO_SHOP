package com.company.haloshop.security.service;

import java.util.Date;
import java.time.LocalDateTime;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.security.JwtBlacklistDto;
import com.company.haloshop.dto.security.JwtWhitelistDto;
import com.company.haloshop.dto.security.SignupRequest;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.UserMapper;
import com.company.haloshop.security.JwtTokenProvider;
import com.company.haloshop.security.mapper.JwtBlacklistMapper;
import com.company.haloshop.security.mapper.JwtWhitelistMapper;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AccountMapper accountMapper;
    private final UserMapper userMapper;
    private final UserPointService userPointService;      // 포인트 초기화 서비스 주입
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtWhitelistMapper jwtWhitelistMapper;
    private final JwtBlacklistMapper jwtBlacklistMapper;

    private final PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();
    private final PasswordEncoder argon2Encoder = new Argon2PasswordEncoder();

    public LoginResponse login(String email, String rawPassword) {
        AccountDto account = accountMapper.selectByEmail(email);
        if (account == null) {
            throw new RuntimeException("가입되지 않은 이메일입니다.");
        }

        if (account.getIsAdmin()) {
            // 관리자 로그인 (세션 방식)
            if (!argon2Encoder.matches(rawPassword, account.getPassword())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다.");
            }
            // 관리자 lastActive 갱신 (필요시)
            account.setLastActive(new Date());
            accountMapper.updateAccountLastActive(account.getId(), account.getLastActive());

            return LoginResponse.adminSuccess(account);
        } else {
            // 일반 유저 로그인 (JWT 방식)
            if (!bcryptEncoder.matches(rawPassword, account.getPassword())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다.");
            }

            // 로그인 성공 시 lastActive 현재 시간으로 업데이트
            account.setLastActive(new Date());
            accountMapper.updateAccountLastActive(account.getId(), account.getLastActive());

            String accessToken = jwtTokenProvider.createAccessToken(email, account.getId());
            String refreshToken = jwtTokenProvider.createRefreshToken(email);

            // 기존 유저 토큰 비활성화 또는 삭제 처리
            jwtWhitelistMapper.deleteAllByAccountId(account.getId());

            // 새 토큰 화이트리스트 등록
            JwtWhitelistDto whitelistDto = new JwtWhitelistDto();
            whitelistDto.setAccountId(account.getId());
            whitelistDto.setRefreshToken(refreshToken);
            whitelistDto.setIssuedAt(jwtTokenProvider.getIssuedAt(refreshToken));
            whitelistDto.setExpiresAt(jwtTokenProvider.getExpiration(refreshToken));
            whitelistDto.setIsActive(true);
            whitelistDto.setCreatedAt(new Date());

            jwtWhitelistMapper.insertWhitelist(whitelistDto);

            return LoginResponse.userSuccess(account, accessToken, refreshToken);
        }
    }

    public void logout(Long accountId, String refreshToken, String accessToken, boolean isAdmin, HttpServletRequest request) {
        if (isAdmin) {
            // 관리자 세션 무효화
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            // 추가로 로그 기록이나 후처리 가능
        } else {
            // 화이트리스트에서 토큰 비활성화 처리
            jwtWhitelistMapper.deactivateToken(accountId, refreshToken);

            // 블랙리스트에 액세스 토큰 등록
            JwtBlacklistDto blacklistDto = new JwtBlacklistDto();
            blacklistDto.setAccountId(accountId);
            blacklistDto.setRefreshToken(refreshToken);
            blacklistDto.setAccessToken(accessToken);
            blacklistDto.setIssuedAt(jwtTokenProvider.getIssuedAt(accessToken));
            blacklistDto.setExpiresAt(jwtTokenProvider.getExpiration(accessToken));
            blacklistDto.setBlacklistedAt(new Date());
            blacklistDto.setReason("사용자 로그아웃");

            jwtBlacklistMapper.insertBlacklist(blacklistDto);
        }
    }

    // 이메일 중복 검사
    public boolean isEmailDuplicate(String email) {
        AccountDto account = accountMapper.selectByEmail(email);
        return account != null;
    }

    /**
     * 회원가입 처리 (account + user 테이블 동시 등록)
     * 그리고 user_point 초기화
     */
    @Transactional
    public void signup(SignupRequest request, HttpServletRequest httpRequest) {
        if (isEmailDuplicate(request.getEmail())) {
            throw new RuntimeException("이미 사용중인 이메일입니다.");
        }

        String encodedPassword = bcryptEncoder.encode(request.getPassword());

        // --- Account 생성 ---
        AccountDto newAccount = new AccountDto();
        newAccount.setEmail(request.getEmail());
        newAccount.setPassword(encodedPassword);
        newAccount.setNickname(request.getNickname());
        newAccount.setIsAdmin(false);
        newAccount.setEmailChk(false);
        newAccount.setPhone(request.getPhone());
        newAccount.setUserStatusId(1);
        newAccount.setSocialId(1);
        newAccount.setCreatedAt(new Date());

        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        newAccount.setIp(ipAddress);

        accountMapper.insertAccount(newAccount);

        // --- User 생성 ---
        UserDto newUser = new UserDto();
        newUser.setAccountId(newAccount.getId());
        newUser.setAddress(request.getAddress());
        newUser.setAddressDetail(request.getAddressDetail());
        newUser.setZipcode(request.getZipcode());
        newUser.setBirth(request.getBirth());
        newUser.setGender(request.getGender());

        userMapper.insertUser(newUser);

        // --- UserPoint 초기화 ---
        userPointService.initializeUserPoint(newAccount.getId());
    }

    public static class LoginResponse {
        private boolean isAdmin;
        private AccountDto account;
        private String accessToken;
        private String refreshToken;

        public static LoginResponse adminSuccess(AccountDto account) {
            LoginResponse res = new LoginResponse();
            res.isAdmin = true;
            res.account = account;
            return res;
        }

        public static LoginResponse userSuccess(AccountDto account, String accessToken, String refreshToken) {
            LoginResponse res = new LoginResponse();
            res.isAdmin = false;
            res.account = account;
            res.accessToken = accessToken;
            res.refreshToken = refreshToken;
            return res;
        }

        // getters
        public boolean isAdmin() { return isAdmin; }
        public AccountDto getAccount() { return account; }
        public String getAccessToken() { return accessToken; }
        public String getRefreshToken() { return refreshToken; }
    }

    public boolean isAdmin(Long accountId) {
        AccountDto account = accountMapper.selectById(accountId);
        if (account == null) {
            throw new RuntimeException("존재하지 않는 계정입니다.");
        }
        return account.getIsAdmin();
    }
}
