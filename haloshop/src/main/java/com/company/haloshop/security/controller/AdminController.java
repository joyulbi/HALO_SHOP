package com.company.haloshop.security.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.security.Role;
import com.company.haloshop.security.service.AdminService;

/**
 * 관리자 권한 관련 API 컨트롤러
 * - 마스터 관리자에 의한 권한 승격 처리
 * - 역할 리스트 조회 등
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AccountMapper accountMapper;
    private final AdminMapper adminMapper;
    private final AdminService adminService;

    /**
     * 생성자 주입
     */
    public AdminController(AccountMapper accountMapper, AdminMapper adminMapper, AdminService adminService) {
        this.accountMapper = accountMapper;
        this.adminMapper = adminMapper;
        this.adminService = adminService;
    }

    /**
     * 마스터 관리자 권한으로 유저를 어드민으로 승격
     * @param dto 승격 대상 및 역할 정보
     * @return 승격 완료/실패 메시지
     */
    @PostMapping("/promote")
    public ResponseEntity<?> promoteUserToAdmin(@RequestBody PromoteRequest dto) {
        try {
            // AdminService 내부에서 전체 처리 위임
            adminService.promoteToAdmin(
                dto.getAssignedBy(),        // 승격 요청자 (마스터 관리자)
                dto.getTargetAccountId(),   // 승격 대상 ID
                dto.getRoleId(),            // 설정할 권한 ID
                dto.getNewPassword(),       // 새 비밀번호
                dto.getEmail(),             // 프론트에서 전달된 이메일
                dto.getLastIp()             // 마지막 접속 IP
            );
            return ResponseEntity.ok("권한 승격 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("승격 처리 중 오류 발생: " + e.getMessage());
        }
    }

    /**
     * 선택 가능한 권한(Role) 리스트 반환
     * - roleId < 1000 인 관리자 전용 권한만 필터링
     */
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = List.of(Role.values())
            .stream()
            .filter(role -> role.getRoleId() < 1000)  // 일반 유저(1000 이상)는 제외
            .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    /**
     * 승격 요청 DTO 내부 클래스
     */
    public static class PromoteRequest {
        private Long targetAccountId;  // 승격 대상 계정 ID
        private int roleId;           // 부여할 권한 ID
        private Long assignedBy;      // 마스터 관리자 ID
        private String lastIp;        // IP 주소
        private String newPassword;   // 새 비밀번호
        private String email;         // 이메일 추가

        // Getter & Setter
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

        public Long getAssignedBy() {
            return assignedBy;
        }

        public void setAssignedBy(Long assignedBy) {
            this.assignedBy = assignedBy;
        }

        public String getLastIp() {
            return lastIp;
        }

        public void setLastIp(String lastIp) {
            this.lastIp = lastIp;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
