package com.company.haloshop.security.service;

import java.util.List;
import java.util.stream.Collectors;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.member.UserStatusDto;
import com.company.haloshop.dto.member.UserUpdateRequest;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.member.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * AdminUserService 구현체
 */
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AccountMapper accountMapper;
    private final UserMapper    userMapper;
    private final AdminMapper   adminMapper;

    @Override
    public Page<AccountDto> getUserList(int page, int size, String email, String nickname, UserStatusDto statusDto) {
        List<AccountDto> all = accountMapper.selectAll();
        List<AccountDto> filtered = all.stream()
            .filter(a -> email     == null || a.getEmail().contains(email))
            .filter(a -> nickname  == null || a.getNickname().contains(nickname))
            .filter(a -> statusDto == null || a.getUserStatusId().equals(statusDto.getId()))
            .collect(Collectors.toList());

        int start = page * size;
        int end   = Math.min(start + size, filtered.size());
        List<AccountDto> content = (start <= end) ? filtered.subList(start, end) : List.of();
        return new PageImpl<>(content, PageRequest.of(page, size), filtered.size());
    }

    @Override
    public AccountDto getAccount(Long accountId) {
        return accountMapper.selectById(accountId);
    }

    @Override
    public UserDto getUserProfile(Long accountId) {
        return userMapper.selectByAccountId(accountId);
    }

    @Override
    public AdminDto getAdminDetail(Long accountId) {
        // 관리자 테이블에 기록이 없으면 null 반환
        return adminMapper.selectByAccountId(accountId);
    }

    @Override
    @Transactional
    public void updateUser(Long accountId, UserUpdateRequest req) {
        // Account 업데이트
        var account = accountMapper.selectById(accountId);
        if (req.getNickname()      != null) account.setNickname(req.getNickname());
        if (req.getEmail()         != null) account.setEmail(req.getEmail());
        if (req.getPhone()         != null) account.setPhone(req.getPhone());
        accountMapper.updateAccountFields(account);

        // User 프로필 업데이트
        var user = userMapper.selectByAccountId(accountId);
        if (req.getAddress()       != null) user.setAddress(req.getAddress());
        if (req.getAddressDetail() != null) user.setAddressDetail(req.getAddressDetail());
        if (req.getZipcode()       != null) user.setZipcode(Integer.valueOf(req.getZipcode()));
        if (req.getBirth()         != null) user.setBirth(java.sql.Date.valueOf(req.getBirth()));
        if (req.getGender()        != null) user.setGender(req.getGender());
        userMapper.updateUser(user);
    }

    @Override
    @Transactional
    public void changeStatus(Long accountId, UserStatusDto statusDto) {
        var account = accountMapper.selectById(accountId);
        account.setUserStatusId(statusDto.getId());
        accountMapper.updateAccountFields(account);
    }
}
