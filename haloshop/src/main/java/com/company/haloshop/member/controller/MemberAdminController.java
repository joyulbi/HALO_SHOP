package com.company.haloshop.member.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
     * 로그인된 관리자의 정보를 리턴
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyAdminInfo(
        @AuthenticationPrincipal(expression = "id") Long principalId,
        Authentication authentication // 인증 객체도 받아서 로그 찍기
    ) {
        System.out.println("====== /admin/me 진입 ======");
        System.out.println("principalId: " + principalId);
        System.out.println("Authentication: " + authentication);
        if (authentication != null) {
            System.out.println("Principal: " + authentication.getPrincipal());
            System.out.println("Details: " + authentication.getDetails());
            System.out.println("Authorities: " + authentication.getAuthorities());
        }
        System.out.println("==================================");

        if (principalId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인이 필요합니다."));
        }
        try {
            AccountDto accountDto = adminService.getAccountById(principalId);
            if (accountDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "계정을 찾을 수 없습니다."));
            }
            AdminDto adminDto = adminService.getAdminByAccountId(principalId);
            if (adminDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "관리자 정보를 찾을 수 없습니다."));
            }
            return ResponseEntity.ok(Map.of(
                "account", accountDto,
                "admin", adminDto
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류: " + e.getMessage()));
        }
    }

    /**
     * 관리자 정보 수정 API
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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
