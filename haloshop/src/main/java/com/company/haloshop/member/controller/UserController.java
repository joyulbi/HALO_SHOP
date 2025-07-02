package com.company.haloshop.member.controller;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.member.service.UserService;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 내정보 조회 API
     * 로그인된 사용자의 정보를 리턴
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal(expression = "id") Long principalId) {
        if (principalId == null) {
            // 인증 정보 없음: 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인이 필요합니다."));
        }
        try {
            AccountDto accountDto = userService.getAccountById(principalId);
            if (accountDto == null) {
                // DB에 없는 계정: 404
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "계정을 찾을 수 없습니다."));
            }
            UserDto userDto = userService.getUserByAccountId(principalId);
            return ResponseEntity.ok(Map.of(
                "account", accountDto,
                "user", userDto
            ));
        } catch (Exception e) {
            // 서버 내부 에러
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류: " + e.getMessage()));
        }
    }


    // 응답용 DTO (내정보 응답 형태)
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
}