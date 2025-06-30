package com.company.haloshop.security.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.security.LoginRequest;
import com.company.haloshop.dto.security.LogoutRequest;
import com.company.haloshop.dto.security.SignupRequest;
import com.company.haloshop.dto.security.JwtLoginResponse;
import com.company.haloshop.security.service.AuthenticationService;
import com.company.haloshop.security.service.AuthenticationService.LoginResponse;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
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
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {
        try {
            // accessToken 파라미터 추가
            authenticationService.logout(request.getAccountId(), request.getRefreshToken(), request.getAccessToken());
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    
}

