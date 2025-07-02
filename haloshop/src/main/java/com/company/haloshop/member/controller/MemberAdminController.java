package com.company.haloshop.member.controller;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.member.service.MemberAdminService;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
            // 인증 정보 없음: 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인이 필요합니다."));
        }
        try {
            AccountDto accountDto = adminService.getAccountById(principalId);
            if (accountDto == null) {
                // DB에 없는 계정: 404
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
            // 서버 내부 에러
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류: " + e.getMessage()));
        }
    }
}
