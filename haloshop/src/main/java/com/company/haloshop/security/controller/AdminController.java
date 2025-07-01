package com.company.haloshop.security.controller;

import java.security.Principal;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.security.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final AccountMapper accountMapper;
    private final HttpServletRequest request;

    public AdminController(AdminService adminService, AccountMapper accountMapper, HttpServletRequest request) {
        this.adminService = adminService;
        this.accountMapper = accountMapper;
        this.request = request;
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
            adminService.promoteToAdmin(masterAdmin.getId(), dto.getTargetAccountId(), dto.getRoleId(), dto.getNewPassword(), clientIp);

            return ResponseEntity.ok("권한 승격 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("승격 실패: " + e.getMessage());
        }
    }

    private int getAdminRoleId(Long accountId) {
        // admin 테이블에서 role 조회 (accountId로 조회)
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
