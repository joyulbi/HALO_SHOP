package com.company.haloshop.member.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.member.UserUpdateRequest;
import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.member.service.UserService;
import com.company.haloshop.member.service.UserService.UpdateResult;
import com.company.haloshop.userpoint.UserPointService;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final UserPointService userPointService;
    

    public UserController(UserService userService,UserPointService userPointService) {
        this.userService = userService;
        this.userPointService = userPointService;
    }

    /**
     * 내정보 조회 API (GET /user/me)
     * - 로그인된 사용자의 정보를 리턴
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal(expression = "id") Long principalId) {
        if (principalId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인이 필요합니다."));
        }
        try {
            AccountDto accountDto = userService.getAccountById(principalId);
            if (accountDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "계정을 찾을 수 없습니다."));
            }
            UserDto userDto = userService.getUserByAccountId(principalId);

            // ✅ userPointDto 추가
            UserPointDto userPointDto = userPointService.findByAccountId(principalId);

            return ResponseEntity.ok(Map.of(
                "account", accountDto,
                "user", userDto,
                "userPointDto", userPointDto // ✅ 멤버십 및 포인트 함께 반환
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류: " + e.getMessage()));
        }
    }


    /**
     * 내정보 수정 API (PUT /user/me)
     * - accessToken/refreshToken 헤더로 받기
     * - 이메일 변경 시 토큰 재발급
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateMyInfo(
        @AuthenticationPrincipal(expression = "id") Long principalId,
        @RequestBody UserUpdateRequest req,
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @RequestHeader(value = "X-Refresh-Token", required = false) String refreshTokenHeader
    ) {
        if (principalId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인이 필요합니다."));
        }

        // Bearer 토큰 파싱
        String accessToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            accessToken = authorizationHeader.substring(7);
        } else {
            accessToken = authorizationHeader;
        }
        String refreshToken = refreshTokenHeader;

        try {
            UpdateResult result = userService.updateMyInfo(principalId, req, accessToken, refreshToken);

            // 이메일이 변경되면 새 토큰 반환
            if (result.isEmailChanged()) {
                return ResponseEntity.ok(Map.of(
                    "result", "수정 완료",
                    "accessToken", result.getNewAccessToken(),
                    "refreshToken", result.getNewRefreshToken(),
                    "emailChanged", true
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "result", "수정 완료",
                    "emailChanged", false
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류: " + e.getMessage()));
        }
    }

    // 응답용 DTO (내정보 응답 형태) — 필요 없으면 제거해도 됨
    public static class MyInfoResponse {
        private AccountDto account;
        private UserDto user;

        public MyInfoResponse(AccountDto account, UserDto user) {
            this.account = account;
            this.user = user;
        }

        public AccountDto getAccount() {
            return account;
        }

        public UserDto getUser() {
            return user;
        }
    }
    
    /**
     * [공개용] 유저 정보 단건 조회 API (GET /user/{accountId})
     * - 경매 낙찰자 정보 확인 등에서 사용
     * - 인증 불필요
     */
    @GetMapping("/{accountId}")
    public ResponseEntity<?> getUserByAccountId(@PathVariable Long accountId) {
        try {
            AccountDto accountDto = userService.getAccountById(accountId);
            if (accountDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "계정을 찾을 수 없습니다."));
            }

            UserDto userDto = userService.getUserByAccountId(accountId);
            return ResponseEntity.ok(Map.of(
                "account", accountDto,
                "user", userDto
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류: " + e.getMessage()));
        }
    }
}
