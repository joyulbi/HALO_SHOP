package com.company.haloshop.member.service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.member.UserUpdateRequest;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.UserMapper;
import com.company.haloshop.security.JwtTokenProvider;
import com.company.haloshop.security.mapper.JwtBlacklistMapper;
import com.company.haloshop.security.mapper.JwtWhitelistMapper;
import com.company.haloshop.dto.security.JwtWhitelistDto;
import com.company.haloshop.dto.security.JwtBlacklistDto;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class UserServiceImpl implements UserService {

    private final AccountMapper accountMapper;
    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtWhitelistMapper jwtWhitelistMapper;
    private final JwtBlacklistMapper jwtBlacklistMapper;

    public UserServiceImpl(
        AccountMapper accountMapper,
        UserMapper userMapper,
        JwtTokenProvider jwtTokenProvider,
        JwtWhitelistMapper jwtWhitelistMapper,
        JwtBlacklistMapper jwtBlacklistMapper
    ) {
        this.accountMapper = accountMapper;
        this.userMapper = userMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtWhitelistMapper = jwtWhitelistMapper;
        this.jwtBlacklistMapper = jwtBlacklistMapper;
    }

    @Override
    public AccountDto getAccountById(Long id) {
        return accountMapper.selectById(id);
    }

    @Override
    public UserDto getUserByAccountId(Long accountId) {
        return userMapper.selectByAccountId(accountId);
    }

    @Override
    public UpdateResult updateMyInfo(Long principalId, UserUpdateRequest req, String accessToken, String refreshToken) {
        boolean emailChanged = false;
        String newAccessToken = null;
        String newRefreshToken = null;

        AccountDto acc = accountMapper.selectById(principalId);
        if (acc != null) {
            // ⭐ 1. 이메일이 실제로 변경되는 경우만 체크
            if (req.getEmail() != null && !req.getEmail().equals(acc.getEmail())) {

                // ⭐ 2. 중복 검사: 이미 존재하는 이메일이 있으면 예외 발생
                AccountDto dup = accountMapper.selectByEmail(req.getEmail());
                if (dup != null) {
                    // 이미 있는 이메일이면 예외 발생!
                    throw new RuntimeException("이미 존재하는 이메일입니다.");
                    // -> 실무에선 DuplicateEmailException 등 커스텀으로 따로 던지는 게 더 좋음!
                }

                // 중복 아니면 정상적으로 변경
                acc.setEmail(req.getEmail());
                emailChanged = true;
            }
            if (req.getNickname() != null) acc.setNickname(req.getNickname());
            accountMapper.updateAccount(acc);
        }

        UserDto dto = new UserDto();
        dto.setAccountId(principalId);
        dto.setAddress(req.getAddress());
        dto.setAddressDetail(req.getAddressDetail());
        if (req.getZipcode() != null && !req.getZipcode().isEmpty()) {
            try { dto.setZipcode(Integer.parseInt(req.getZipcode())); } catch (Exception e) { dto.setZipcode(null);}
        }
        if (req.getBirth() != null && !req.getBirth().isEmpty()) {
            try { dto.setBirth(new SimpleDateFormat("yyyy-MM-dd").parse(req.getBirth())); } catch (Exception e) { dto.setBirth(null);}
        }
        dto.setGender(req.getGender());
        userMapper.updateUser(dto);

        // 토큰 갱신/무효화
        if (emailChanged && accessToken != null && refreshToken != null) {
            jwtWhitelistMapper.deactivateToken(principalId, refreshToken);
            JwtBlacklistDto blacklistDto = new JwtBlacklistDto();
            blacklistDto.setAccountId(principalId);
            blacklistDto.setRefreshToken(refreshToken);
            blacklistDto.setAccessToken(accessToken);
            blacklistDto.setIssuedAt(jwtTokenProvider.getIssuedAt(accessToken));
            blacklistDto.setExpiresAt(jwtTokenProvider.getExpiration(accessToken));
            blacklistDto.setBlacklistedAt(new Date());
            blacklistDto.setReason("이메일 변경으로 인한 토큰 무효화");
            jwtBlacklistMapper.insertBlacklist(blacklistDto);

            newAccessToken = jwtTokenProvider.createAccessToken(acc.getEmail(), principalId);
            newRefreshToken = jwtTokenProvider.createRefreshToken(acc.getEmail());

            JwtWhitelistDto whitelistDto = new JwtWhitelistDto();
            whitelistDto.setAccountId(principalId);
            whitelistDto.setRefreshToken(newRefreshToken);
            whitelistDto.setIssuedAt(jwtTokenProvider.getIssuedAt(newRefreshToken));
            whitelistDto.setExpiresAt(jwtTokenProvider.getExpiration(newRefreshToken));
            whitelistDto.setIsActive(true);
            whitelistDto.setCreatedAt(new Date());
            jwtWhitelistMapper.insertWhitelist(whitelistDto);
        }

        // 반드시 UserService.UpdateResult 타입 반환!
        return new UpdateResult(emailChanged, newAccessToken, newRefreshToken);
    }
}
