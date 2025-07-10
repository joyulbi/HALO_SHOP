package com.company.haloshop.security.controller;

import java.security.Principal;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionInformation;
import java.util.List;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.security.service.AdminService;
import com.company.haloshop.security.CustomUserDetails;

/**
 * 관리자용 컨트롤러
 * - 권한 승격 및 세션 강제 로그아웃 기능 포함
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final AccountMapper accountMapper;
    private final HttpServletRequest request;
    private final SessionRegistry sessionRegistry;

    public AdminController(AdminService adminService,
                           AccountMapper accountMapper,
                           HttpServletRequest request,
                           SessionRegistry sessionRegistry) {
        this.adminService = adminService;
        this.accountMapper = accountMapper;
        this.request = request;
        this.sessionRegistry = sessionRegistry;
    }

    /**
     * 마스터 관리자 권한으로 유저를 어드민으로 승격
     */
    @PostMapping("/promote")
    public ResponseEntity<?> promoteUserToAdmin(@RequestBody PromoteRequest dto, Principal principal) {
        try {
            // 1. 로그인한 마스터 관리자 이메일로 계정 조회
            AccountDto masterAdmin = accountMapper.selectByEmail(principal.getName());
            if (masterAdmin == null || !masterAdmin.getIsAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
            }

            // 2. 마스터 관리자 role 체크 (0~99 범위만 허용)
            int masterRoleId = getAdminRoleId(masterAdmin.getId());
            if (masterRoleId < 0 || masterRoleId > 99) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("마스터 관리자만 권한 승격이 가능합니다.");
            }

            // 3. 클라이언트 IP 추출
            String clientIp = getClientIp(request);

            // 4. 권한 승격 서비스 호출
            adminService.promoteToAdmin(
                masterAdmin.getId(),
                dto.getTargetAccountId(),
                dto.getRoleId(),
                dto.getNewPassword(),
                clientIp
            );

            return ResponseEntity.ok("권한 승격 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("승격 실패: " + e.getMessage());
        }
    }

    /**
     * accountId에 해당하는 어드민 세션을 강제 로그아웃 처리
     */
    @PostMapping("/force-logout/account")
    public ResponseEntity<Void> forceLogoutByAccount(@RequestParam("accountId") Long accountId) {
        // 세션 레지스트리에서 해당 accountId 세션 만료
        sessionRegistry.getAllPrincipals().stream()
            .filter(p -> p instanceof CustomUserDetails
                         && ((CustomUserDetails) p).getId().equals(accountId))
            .flatMap(p -> sessionRegistry.getAllSessions(p, false).stream())
            .forEach(SessionInformation::expireNow);

        return ResponseEntity.noContent().build();
    }

    private int getAdminRoleId(Long accountId) {
        Integer role = adminService.getRoleByAccountId(accountId);
        return role != null ? role : -1;
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    // DTO 정의
    public static class PromoteRequest {
        private Long targetAccountId;
        private int roleId;
        private String newPassword;

        public Long getTargetAccountId() {
            return targetAccountId;
        }

        public void setTargetAccountId(Long targetAccountId) {
            this.targetAccountId = targetAccountId;
        }

        public int getRoleId() {
            return roleId;
        }

        public void setRoleId(int roleId) {
            this.roleId = roleId;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
