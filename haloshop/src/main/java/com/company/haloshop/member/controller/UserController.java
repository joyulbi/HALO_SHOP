package com.company.haloshop.member.controller;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.member.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
            // 인증 정보 없으면 401 Unauthorized 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: 로그인 필요");
        }

        try {
            AccountDto accountDto = userService.getAccountById(principalId);
            UserDto userDto = userService.getUserByAccountId(principalId);

            return ResponseEntity.ok(new MyInfoResponse(accountDto, userDto));
        } catch (Exception e) {
            // 내부 에러는 400 Bad Request로 처리 (필요시 다른 상태 코드 사용 가능)
            return ResponseEntity.badRequest().body(e.getMessage());
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
