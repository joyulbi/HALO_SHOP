package com.company.haloshop.security.controller;

import java.security.Principal;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionInformation;
import java.util.List;
import java.util.stream.Collectors;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.security.service.AdminService;
import com.company.haloshop.security.CustomUserDetails;
import com.company.haloshop.security.Role;

/**
 * 관리자용 컨트롤러
 * - 권한 승격 및 세션 강제 로그아웃 기능 포함
 */
@RestController
@RequestMapping("/admin") // /admin으로 시작하는 모든 경로를 처리
public class AdminController {

    private final AdminService adminService; // 서비스 레이어
    private final AccountMapper accountMapper; // Account 데이터 매퍼
    private final HttpServletRequest request; // HTTP 요청 객체
    private final SessionRegistry sessionRegistry; // 세션 관리 객체

    // 생성자 주입
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
     * @param dto 승격 대상 및 역할 정보
     * @param principal 현재 로그인한 사용자 정보
     * @return 승격 완료/실패 메시지
     */
    @PostMapping("/promote")
    public ResponseEntity<?> promoteUserToAdmin(@RequestBody PromoteRequest dto, Principal principal) {
        try {
            // 1. 로그인한 마스터 관리자의 이메일을 통해 계정 조회
            AccountDto masterAdmin = accountMapper.selectByEmail(principal.getName());
            if (masterAdmin == null || !masterAdmin.getIsAdmin()) {
                // 로그인한 사용자가 마스터 관리자가 아니라면 접근 차단
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
            }

            // 2. 마스터 관리자의 role 체크 (0~99 범위만 허용)
            int masterRoleId = getAdminRoleId(masterAdmin.getId());
            if (masterRoleId < 0 || masterRoleId > 99) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("마스터 관리자만 권한 승격이 가능합니다.");
            }

            // 3. 클라이언트 IP 추출 (로그 추적용)
            String clientIp = getClientIp(request);

            // 4. 권한 승격 서비스 호출: 마스터 관리자가 승격 대상을 어드민으로 승격시킴
            adminService.promoteToAdmin(
                masterAdmin.getId(),
                dto.getTargetAccountId(),
                dto.getRoleId(),
                dto.getNewPassword(),
                clientIp
            );

            // 5. 성공적으로 승격되었음을 응답
            return ResponseEntity.ok("권한 승격 완료");
        } catch (Exception e) {
            // 예외 발생 시 응답
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("승격 실패: " + e.getMessage());
        }
    }

    /**
     * 특정 계정에 대해 세션을 강제로 만료시켜 로그아웃 처리
     * @param accountId 강제 로그아웃할 계정의 ID
     * @return 로그아웃 처리 결과
     */
    @PostMapping("/force-logout/account")
    public ResponseEntity<Void> forceLogoutByAccount(@RequestParam("accountId") Long accountId) {
        // 세션 레지스트리에서 해당 accountId의 세션을 만료시킴
        sessionRegistry.getAllPrincipals().stream()
            .filter(p -> p instanceof CustomUserDetails
                         && ((CustomUserDetails) p).getId().equals(accountId))
            .flatMap(p -> sessionRegistry.getAllSessions(p, false).stream())
            .forEach(SessionInformation::expireNow);

        return ResponseEntity.noContent().build(); // 세션 만료 후 204 No Content 응답
    }

    /**
     * 주어진 accountId에 대한 관리자 역할 정보를 가져옴
     * @param accountId 조회할 계정 ID
     * @return 관리자 역할 ID
     */
    private int getAdminRoleId(Long accountId) {
        Integer role = adminService.getRoleByAccountId(accountId);
        return role != null ? role : -1; // 역할 ID가 없으면 -1 반환
    }

    /**
     * 클라이언트의 IP 주소를 가져오는 메서드
     * @param request HTTP 요청 객체
     * @return 클라이언트 IP 주소
     */
    private String getClientIp(HttpServletRequest request) {
        // X-Forwarded-For 헤더에서 클라이언트 IP 추출 (프록시 서버 뒤에 있을 경우)
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr(); // 프록시 서버가 없으면 직접 IP 가져오기
        }
        return ip;
    }

    // DTO 정의 (승격 요청에 필요한 데이터)
    public static class PromoteRequest {
        private Long targetAccountId; // 승격 대상 계정 ID
        private int roleId; // 새로운 역할 ID (어드민 등)
        private String newPassword; // 새로운 비밀번호

        // Getter와 Setter 메서드
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

    /**
     * 권한 리스트를 반환하는 API
     * - 승격 시 선택 가능한 권한 목록을 반환
     * - 마스터 관리자가 유저를 승격시킬 수 있는 권한 리스트 제공
     */
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        // Role enum을 사용하여, 관리자가 승격할 수 있는 권한 목록을 반환
        List<Role> roles = List.of(Role.values())
                .stream()
                .filter(role -> role.getRoleId() < 1000)  // 일반 유저 제외 (일반 유저 제외하고 반환)
                .collect(Collectors.toList());

        return ResponseEntity.ok(roles);
    }
}
