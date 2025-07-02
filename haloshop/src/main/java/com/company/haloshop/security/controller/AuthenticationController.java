package com.company.haloshop.security.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.security.LoginRequest;
import com.company.haloshop.dto.security.LogoutRequest;
import com.company.haloshop.dto.security.SignupRequest;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.security.JwtLoginResponse;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.security.service.AuthenticationService;
import com.company.haloshop.security.service.AuthenticationService.LoginResponse;
import com.company.haloshop.security.JwtTokenProvider;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final AccountMapper accountMapper;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthenticationController(AuthenticationService authenticationService, 
                                    AccountMapper accountMapper,
                                    JwtTokenProvider jwtTokenProvider) {
        this.authenticationService = authenticationService;
        this.accountMapper = accountMapper;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authenticationService.login(request.getEmail(), request.getPassword());

            if (response.isAdmin()) {
                return ResponseEntity.ok("관리자 로그인 성공");
            } else {
                return ResponseEntity.ok(new JwtLoginResponse(
                    response.getAccessToken(), response.getRefreshToken()
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 회원가입 API
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request, HttpServletRequest httpRequest) {
        try {
            authenticationService.signup(request, httpRequest);
            return ResponseEntity.ok("회원가입 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request, HttpServletRequest httpRequest) {
        try {
            String accessToken = request.getAccessToken();
            if (!jwtTokenProvider.validateToken(accessToken)) {
                return ResponseEntity.badRequest().body("유효하지 않은 토큰입니다.");
            }
            Long accountId = jwtTokenProvider.getAccountId(accessToken);
            AccountDto account = accountMapper.selectById(accountId);
            if (account == null) {
                return ResponseEntity.badRequest().body("존재하지 않는 계정입니다.");
            }

            authenticationService.logout(
                accountId,
                request.getRefreshToken(),
                accessToken,
                account.getIsAdmin(),
                httpRequest
            );

            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}