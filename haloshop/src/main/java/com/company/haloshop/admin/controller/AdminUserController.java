// Admin 전용 사용자 서비스 (Service 사용으로 리팩터링된 컨트롤러)
package com.company.haloshop.admin.controller;

import com.company.haloshop.admin.service.AdminUserService;
import com.company.haloshop.security.Role;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.admin.controller.AdminUserController.AdminUpdateRequest;
import com.company.haloshop.admin.controller.AdminUserController.AdminDetailResponse;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/user")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    // ✅ 유저 목록 조회
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).USER_ADMIN)")
    @GetMapping("/list")
    public List<AccountDto> getUserList() {
        return adminUserService.getAllUsers();
    }

    // ✅ 단일 유저 조회
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).USER_ADMIN)")
    @GetMapping("/{id}")
    public AccountDto getUser(@PathVariable Long id) {
        return adminUserService.getUserById(id);
    }

    // ✅ 유저 상태 변경
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).USER_ADMIN)")
    @PostMapping("/status/{id}")
    public String updateUserStatus(@PathVariable Long id, @RequestParam int statusId) {
        boolean result = adminUserService.updateUserStatus(id, statusId);
        return result ? "상태 변경 완료" : "해당 유저 없음";
    }

    // ✅ 관리자 상세 조회
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).MASTER_ADMIN)")
    @GetMapping("/admin/{id}")
    public AdminDetailResponse getAdmin(@PathVariable Long id) {
        return adminUserService.getAdminDetail(id);
    }

    // ✅ 관리자 수정
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).MASTER_ADMIN)")
    @PutMapping("/admin/{id}")
    public String updateAdmin(@PathVariable Long id, @RequestBody AdminUpdateRequest dto) {
        boolean result = adminUserService.updateAdmin(id, dto);
        return result ? "업데이트 완료" : "계정 없음";
    }

    // ✅ 관리자 삭제
    @PreAuthorize("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).MASTER_ADMIN)")
    @DeleteMapping("/admin/{id}")
    public String deleteAdmin(@PathVariable Long id) {
        boolean result = adminUserService.deleteAdmin(id);
        return result ? "삭제 완료" : "삭제 실패";
    }

    // ✅ DTO 클래스들
    @Data
    public static class AdminUpdateRequest {
        private String email;
        private String nickname;
        private int role;
        private boolean locked;
    }

    @Data
    @RequiredArgsConstructor
    public static class AdminDetailResponse {
        private final AccountDto account;
        private final AdminDto admin;
    }
} 