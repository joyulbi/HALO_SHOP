package com.company.haloshop.security.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.member.UserStatusDto;
import com.company.haloshop.dto.member.UserUpdateRequest;
import com.company.haloshop.security.CustomUserDetails;
import com.company.haloshop.security.Role;
import com.company.haloshop.security.service.AdminUserService;

import lombok.RequiredArgsConstructor;

/**
 * 유저 관리자(AdminUser) 전용 컨트롤러
 * - 마스터관리자는 본인 계정만 수정/상태 변경 가능
 */
@RestController("securityAdminUserController")
@RequestMapping("/admin/user/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    /** 1) 유저 리스트 조회 */
    @GetMapping
    public ResponseEntity<Page<AccountDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) UserStatusDto status
    ) {
        var result = adminUserService.getUserList(page, size, email, nickname, status);
        return ResponseEntity.ok(result);
    }

    /** 2) 유저 상세 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> detail(
            @PathVariable("id") Long accountId
    ) {
        var account = adminUserService.getAccount(accountId);
        var user    = adminUserService.getUserProfile(accountId);
        var admin   = adminUserService.getAdminDetail(accountId); // null 가능

        Map<String,Object> response = new HashMap<>();
        response.put("account", account);
        response.put("user",    user);
        response.put("admin",   admin);
        return ResponseEntity.ok(response);
    }

    /** 3) 유저 정보 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable("id") Long accountId,
            @RequestBody UserUpdateRequest req,
            Authentication authentication
    ) {
        enforceMasterSelfOnly(accountId, authentication);
        adminUserService.updateUser(accountId, req);
        return ResponseEntity.ok().build();
    }

    /** 4) 유저 상태 변경 */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(
            @PathVariable("id") Long accountId,
            @RequestBody UserStatusDto statusDto,
            Authentication authentication
    ) {
        enforceMasterSelfOnly(accountId, authentication);
        adminUserService.changeStatus(accountId, statusDto);
        return ResponseEntity.ok().build();
    }

    /**
     * 마스터관리자는 본인 계정만 수정/상태 변경 가능하도록 검사.
     * - 본인이 마스터관리자(MASTER_ADMIN)일 때, accountId != 본인ID 이면 403
     */
    private void enforceMasterSelfOnly(Long targetAccountId, Authentication auth) {
        if (!(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new AccessDeniedException("권한이 없습니다.");
        }
        CustomUserDetails cud = (CustomUserDetails) auth.getPrincipal();
        Long loginId = cud.getAccountDto().getId();

        // 마스터 관리자인지 확인
        AdminDto selfAdmin = adminUserService.getAdminDetail(loginId);
        boolean isMaster = selfAdmin != null && Role.MASTER_ADMIN.matches(selfAdmin.getRole());

        // 마스터라면 본인만, 마스터가 아니라면 모든 관리자는 가능
        if (isMaster && !loginId.equals(targetAccountId)) {
            throw new AccessDeniedException("마스터관리자는 본인 계정만 수정할 수 있습니다.");
        }
    }
}
