// src/main/java/com/company/haloshop/security/controller/AdminUserController.java
package com.company.haloshop.security.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.member.AccountDto;
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

    /**
     * 1) 유저 리스트 조회
     */
    @GetMapping
    public ResponseEntity<Page<AccountDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) UserStatusDto status
    ) {
        Page<AccountDto> result = adminUserService.getUserList(page, size, email, nickname, status);
        return ResponseEntity.ok(result);
    }

    /**
     * 2) 유저 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> detail(
            @PathVariable("id") Long accountId
    ) {
        AccountDto account = adminUserService.getAccount(accountId);
        UserDto    user    = adminUserService.getUserProfile(accountId);
        Map<String,Object> response = new HashMap<>();
        response.put("account", account);
        response.put("user",    user);
        // admin 정보는 필요시 추가로 넣어주세요: response.put("admin", adminDto);
        return ResponseEntity.ok(response);
    }

    /**
     * 3) 유저 정보 수정
     */
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

    /**
     * 4) 유저 상태 변경
     */
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
     * - 본인이 마스터관리자일 때, accountId != 본인ID 이면 403
     */
    private void enforceMasterSelfOnly(Long targetAccountId, Authentication auth) {
        if (!(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new AccessDeniedException("권한이 없습니다.");
        }
        CustomUserDetails cud = (CustomUserDetails) auth.getPrincipal();
        Long loginId = cud.getId();

        // Master Admin인지 체크
        boolean isMaster = false;
        if (cud.isAdmin()) {
            // CustomUserDetails에 adminDto가 없으므로, 간단히 role 조회는 서비스나 Mapper 호출로도 가능합니다.
            // 여기서는 인증이 세션 기반이므로, accountId → AdminDto → roleId 검사를 권장.
            // 예시로, ADMIN이면서 id==0~99 범위라고 가정:
            // isMaster = Role.MASTER_ADMIN.matches(adminDto.getRole());
            // (실제 구현에 맞춰 수정)
            isMaster = true; // 실제로는 hasRoleEnum(auth, MASTER_ADMIN) 호출
        }

        if (isMaster && !loginId.equals(targetAccountId)) {
            throw new AccessDeniedException("마스터관리자는 본인 계정만 수정할 수 있습니다.");
        }
    }
}
