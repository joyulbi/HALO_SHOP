package com.company.haloshop.security.service;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

@Service
public class AuthenticationService {

    private final AccountMapper accountMapper;
    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtWhitelistMapper jwtWhitelistMapper;
    private final JwtBlacklistMapper jwtBlacklistMapper;

    private final PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();
    private final PasswordEncoder argon2Encoder = new Argon2PasswordEncoder();

    public AuthenticationService(AccountMapper accountMapper,
                                 UserMapper userMapper,
                                 JwtTokenProvider jwtTokenProvider,
                                 JwtWhitelistMapper jwtWhitelistMapper,
                                 JwtBlacklistMapper jwtBlacklistMapper) {
        this.accountMapper = accountMapper;
        this.userMapper = userMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtWhitelistMapper = jwtWhitelistMapper;
        this.jwtBlacklistMapper = jwtBlacklistMapper;
    }

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
            return LoginResponse.adminSuccess(account);
        } else {
            // 일반 유저 로그인 (JWT 방식)
            if (!bcryptEncoder.matches(rawPassword, account.getPassword())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다.");
            }

            String accessToken = jwtTokenProvider.createAccessToken(email);
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

    public void logout(Long accountId, String refreshToken) {
        // 화이트리스트에서 토큰 비활성화 처리
        jwtWhitelistMapper.deactivateToken(accountId, refreshToken);

        // 블랙리스트에 등록
        JwtBlacklistDto blacklistDto = new JwtBlacklistDto();
        blacklistDto.setAccountId(accountId);
        blacklistDto.setRefreshToken(refreshToken);
        blacklistDto.setIssuedAt(jwtTokenProvider.getIssuedAt(refreshToken));
        blacklistDto.setExpiresAt(jwtTokenProvider.getExpiration(refreshToken));
        blacklistDto.setBlacklistedAt(new Date());
        blacklistDto.setReason("사용자 로그아웃");
        blacklistDto.setBan(true);

        jwtBlacklistMapper.insertBlacklist(blacklistDto);
    }

    // 이메일 중복 검사
    public boolean isEmailDuplicate(String email) {
        AccountDto account = accountMapper.selectByEmail(email);
        return account != null;
    }

    // 회원가입 처리 (account + user 테이블 동시 등록)
    public void signup(SignupRequest request, HttpServletRequest httpRequest) {
        if (isEmailDuplicate(request.getEmail())) {
            throw new RuntimeException("이미 사용중인 이메일입니다.");
        }

        String encodedPassword = bcryptEncoder.encode(request.getPassword());

        AccountDto newAccount = new AccountDto();
        newAccount.setEmail(request.getEmail());
        newAccount.setPassword(encodedPassword);
        newAccount.setNickname(request.getNickname());
        newAccount.setIsAdmin(false);
        newAccount.setEmailChk(false);
        newAccount.setPhone(request.getPhone());
//        newAccount.setUserStatusId(0);
//        newAccount.setSocialId(0);
        
        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        newAccount.setIp(ipAddress);

        accountMapper.insertAccount(newAccount);

        UserDto newUser = new UserDto();
        newUser.setAccountId(newAccount.getId());
        newUser.setAddress(request.getAddress());
        newUser.setAddressDetail(request.getAddressDetail());
        newUser.setZipcode(request.getZipcode());
        newUser.setBirth(request.getBirth());
        newUser.setGender(request.getGender());

        userMapper.insertUser(newUser);
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
}
