package com.company.haloshop.security.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
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

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AccountMapper accountMapper;
    private final AdminMapper adminMapper;
    private final AdminService adminService;
    private final Argon2PasswordEncoder argon2PasswordEncoder;

    public AdminController(AccountMapper accountMapper, AdminMapper adminMapper, AdminService adminService) {
        this.accountMapper = accountMapper;
        this.adminMapper = adminMapper;
        this.adminService = adminService;
        this.argon2PasswordEncoder = new Argon2PasswordEncoder();
    }

    /**
     * 마스터 관리자 권한으로 유저를 어드민으로 승격
     * @param dto 승격 대상 및 역할 정보
     * @return 승격 완료/실패 메시지
     */
    @PostMapping("/promote")
    public ResponseEntity<?> promoteUserToAdmin(@RequestBody PromoteRequest dto) {
        try {
            // 1. 승격 대상 계정 존재 여부 확인
            AccountDto targetUser = accountMapper.selectById(dto.getTargetAccountId());
            if (targetUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("대상 계정이 존재하지 않습니다.");
            }

            // 2. 새로운 역할을 Role enum으로 변환
            Role role = Role.fromId(dto.getRoleId());
            if (role == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 역할입니다.");
            }

            // 3. 새 비밀번호 해싱
            String hashedPassword = argon2PasswordEncoder.encode(dto.getNewPassword());

            // 4. 관리자 승격을 위해 account 테이블 업데이트
            AccountDto accountDto = new AccountDto();
            accountDto.setId(dto.getTargetAccountId());
            accountDto.setPassword(hashedPassword);  // 새 비밀번호 설정
            accountDto.setIsAdmin(true);  // 어드민으로 승격

            // 5. Account 비밀번호 및 권한 업데이트
            accountMapper.updateAccount(accountDto);

            // 6. admin 테이블에 해당 계정의 role 및 정보 업데이트
            AdminDto adminDto = new AdminDto();
            adminDto.setAccountId(dto.getTargetAccountId());
            adminDto.setRole(dto.getRoleId());  // 전달된 roleId로 승격
            adminDto.setAssignedBy(dto.getAssignedBy());
            adminDto.setLastIp(dto.getLastIp());
            adminDto.setUpdatedAt(new java.util.Date());

            // 7. admin 테이블에 role 업데이트 (insert or update 처리)
            adminMapper.updateAdmin(adminDto);

            // 8. 정상 처리 응답
            return ResponseEntity.ok("권한 승격 완료");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("승격 처리 중 오류 발생: " + e.getMessage());
        }
    }

    /**
     * 권한 리스트를 반환하는 API
     * - 승격 시 선택 가능한 권한 목록을 반환
     */
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = List.of(Role.values())
                .stream()
                .filter(role -> role.getRoleId() < 1000)  // 일반 유저 제외
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    public static class PromoteRequest {
        private Long targetAccountId;  // 승격 대상 계정 ID
        private int roleId;           // 새로운 역할 ID
        private Long assignedBy;      // 승격을 수행한 관리자 ID
        private String lastIp;        // 클라이언트 IP
        private String newPassword;   // 새 비밀번호

        // Getters and Setters
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
    }
}
