// Admin 전용 사용자 서비스
package com.company.haloshop.admin.service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.admin.controller.AdminUserController.AdminDetailResponse;
import com.company.haloshop.admin.controller.AdminUserController.AdminUpdateRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AccountMapper accountMapper;
    private final AdminMapper adminMapper;

    // 전체 유저 목록 조회
    public List<AccountDto> getAllUsers() {
        return accountMapper.selectAll();
    }

    // 단일 유저 정보 조회
    public AccountDto getUserById(Long id) {
        return accountMapper.selectById(id);
    }

    // 유저 상태 변경
    public boolean updateUserStatus(Long id, int statusId) {
        AccountDto user = accountMapper.selectById(id);
        if (user == null) return false;
        user.setUserStatusId(statusId);
        accountMapper.updateAccount(user);
        return true;
    }

    // 관리자 상세 정보 조회
    public AdminDetailResponse getAdminDetail(Long id) {
        AccountDto account = accountMapper.selectById(id);
        AdminDto admin = adminMapper.selectByAccountId(id);
        return new AdminDetailResponse(account, admin);
    }

    // 관리자 수정
    public boolean updateAdmin(Long id, AdminUpdateRequest dto) {
        AccountDto account = accountMapper.selectById(id);
        if (account == null) return false;

        account.setEmail(dto.getEmail());
        account.setNickname(dto.getNickname());
        accountMapper.updateAccount(account);

        AdminDto admin = adminMapper.selectByAccountId(id);
        if (admin != null) {
            admin.setRole(dto.getRole());
            admin.setIsLocked(dto.isLocked());
            adminMapper.updateAdmin(admin);
        }
        return true;
    }

    // 관리자 삭제
    public boolean deleteAdmin(Long id) {
        AdminDto admin = adminMapper.selectByAccountId(id);
        AccountDto account = accountMapper.selectById(id);
        if (account == null) return false;

        if (admin != null) adminMapper.deleteByAccountId(id);
        accountMapper.deleteById(id);
        return true;
    }
}
