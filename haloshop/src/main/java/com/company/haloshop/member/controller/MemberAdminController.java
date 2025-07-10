package com.company.haloshop.member.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.AdminUpdateRequest;
import com.company.haloshop.member.service.MemberAdminService;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/admin")
public class MemberAdminController {

    private final MemberAdminService adminService;

    public MemberAdminController(MemberAdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * 관리자 내정보 조회 API
     * 로그인된 관리자의 정보를 리턴하며, CSRF 토큰도 함께 제공
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyAdminInfo(
        @AuthenticationPrincipal(expression = "id") Long principalId,
        Authentication authentication
    ) {
        // 1. 인증 안 된 경우 즉시 차단 (세션 만료 등 포함)
        if (principalId == null || authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인이 필요합니다."));
        }

        try {
            // 2. DB 접근 전에 조건 체크
            AccountDto accountDto = adminService.getAccountById(principalId);
            if (accountDto == null || !Boolean.TRUE.equals(accountDto.getIsAdmin())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "관리자 권한이 없습니다."));
            }

            AdminDto adminDto = adminService.getAdminByAccountId(principalId);
            if (adminDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "관리자 정보를 찾을 수 없습니다."));
            }

            // 3. CSRF 토큰 가져오기
            CsrfToken csrfToken = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest().getAttribute(CsrfToken.class.getName()) instanceof CsrfToken
                ? (CsrfToken) ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                    .getRequest().getAttribute(CsrfToken.class.getName())
                : null;

            String csrfTokenValue = csrfToken != null ? csrfToken.getToken() : "토큰 없음";

            return ResponseEntity.ok(Map.of(
                "account", accountDto,
                "admin", adminDto,
                "csrfToken", csrfTokenValue
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류: " + e.getMessage()));
        }
    }



    /**
     * 관리자 정보 수정 API
     */
    @PreAuthorize("authentication.principal.isAdmin == true")
    @PostMapping("/update")
    public ResponseEntity<?> updateAdminInfo(@RequestBody AdminUpdateRequest request) {
        try {
            adminService.updateAdminAccount(request);
            return ResponseEntity.ok(Map.of("message", "수정 완료"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 오류: " + e.getMessage()));
        }
    }
}