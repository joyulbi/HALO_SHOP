// src/main/java/com/company/haloshop/security/service/AdminUserServiceImpl.java
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
 *  - AccountMapper, UserMapper, AdminMapper 를 사용하여
 *    사용자/관리자 정보 조회·수정·상태변경 로직을 처리
 */
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AccountMapper accountMapper;
    private final UserMapper userMapper;
    private final AdminMapper adminMapper;

    @Override
    public Page<AccountDto> getUserList(int page, int size, String email, String nickname, UserStatusDto statusDto) {
        // 1) DB에서 전체 계정 목록 조회
        List<AccountDto> all = accountMapper.selectAll();
        // 2) 이메일/닉네임/상태 필터링
        List<AccountDto> filtered = all.stream()
            .filter(a -> email     == null || a.getEmail().contains(email))
            .filter(a -> nickname  == null || a.getNickname().contains(nickname))
            .filter(a -> statusDto == null || a.getUserStatusId().equals(statusDto.getId()))
            .collect(Collectors.toList());
        // 3) 페이징 계산
        int start = page * size;
        int end   = Math.min(start + size, filtered.size());
        List<AccountDto> content = (start <= end) ? filtered.subList(start, end) : List.of();
        // 4) PageImpl 반환
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
        // 관리자인 경우 AdminMapper에서 해당 계정의 AdminDto를 조회, 없으면 null 반환
        return adminMapper.selectByAccountId(accountId);
    }

    @Override
    @Transactional
    public void updateUser(Long accountId, UserUpdateRequest req) {
        // ── Account 테이블 업데이트 ──
        AccountDto account = accountMapper.selectById(accountId);
        if (req.getNickname()      != null) account.setNickname(req.getNickname());
        if (req.getEmail()         != null) account.setEmail(req.getEmail());
        if (req.getPhone()         != null) account.setPhone(req.getPhone());
        accountMapper.updateAccountFields(account);

        // ── User 프로필 테이블 업데이트 ──
        UserDto user = userMapper.selectByAccountId(accountId);
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
        // Account 테이블의 user_status_id 필드만 변경
        AccountDto account = accountMapper.selectById(accountId);
        account.setUserStatusId(statusDto.getId());
        accountMapper.updateAccountFields(account);
    }
}
