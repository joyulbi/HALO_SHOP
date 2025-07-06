package com.company.haloshop.admin.controller;

import com.company.haloshop.security.Role;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.member.mapper.AccountMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/user")
@RequiredArgsConstructor
public class AdminUserController {

    private final AccountMapper accountMapper;

    // ✅ 유저 목록 조회
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).USER_ADMIN)")
    @GetMapping("/list")
    public List<AccountDto> getUserList() {
        return accountMapper.selectAll();
    }

    // ✅ 단일 유저 조회
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).USER_ADMIN)")
    @GetMapping("/{id}")
    public AccountDto getUser(@PathVariable Long id) {
        return accountMapper.selectById(id);
    }

    // ✅ 유저 상태 변경
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).USER_ADMIN)")
    @PostMapping("/status/{id}")
    public String updateUserStatus(@PathVariable Long id, @RequestParam int statusId) {
        AccountDto user = accountMapper.selectById(id);
        if (user == null) return "해당 유저 없음";
        user.setUserStatusId(statusId);
        accountMapper.updateAccount(user);
        return "상태 변경 완료";
    }
}
