package com.company.haloshop.security.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.LogsDto;
import com.company.haloshop.dto.security.*;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.security.CustomUserDetails;
import com.company.haloshop.security.JwtTokenProvider;
import com.company.haloshop.security.UserDetailsServiceImpl;
import com.company.haloshop.security.service.AuthenticationService;
import com.company.haloshop.security.service.AuthenticationService.LoginResponse;
import com.company.haloshop.security.service.LogsService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final AccountMapper        accountMapper;
    private final JwtTokenProvider     jwtTokenProvider;
    private final UserDetailsServiceImpl userDetailsService;
    private final LogsService          logsService;

    public AuthenticationController(
        AuthenticationService authenticationService,
        AccountMapper accountMapper,
        JwtTokenProvider jwtTokenProvider,
        UserDetailsServiceImpl userDetailsService,
        LogsService logsService
    ) {
        this.authenticationService = authenticationService;
        this.accountMapper        = accountMapper;
        this.jwtTokenProvider     = jwtTokenProvider;
        this.userDetailsService   = userDetailsService;
        this.logsService          = logsService;
    }

    /** 회원가입 API */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
        @RequestBody SignupRequest request,
        HttpServletRequest httpRequest
    ) {
        String ip    = httpRequest.getRemoteAddr();
        String email = request.getEmail();

        // 1) 회원가입 시도 로그
        logsService.createLog(new LogsDto(
            null,             // id (auto)
            null,             // accountId 아직 없음
            null,             // targetAccountId
            "SIGNUP_ATTEMPT", // action
            "회원가입 시도: " + email,
            ip
        ));

        try {
            authenticationService.signup(request, httpRequest);

            // 2) 회원가입 성공 로그
            logsService.createLog(new LogsDto(
                null,
                null,
                null,
                "SIGNUP_SUCCESS",
                "회원가입 성공: " + email,
                ip
            ));
            return ResponseEntity.ok("회원가입 성공");
        } catch (Exception e) {
            // 3) 회원가입 실패 로그
            logsService.createLog(new LogsDto(
                null,
                null,
                null,
                "SIGNUP_FAILURE",
                "회원가입 실패: " + email + " (" + e.getMessage() + ")",
                ip
            ));
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** 로그인 API */
 // (중략)

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody LoginRequest request,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse
    ) {
        String ip    = httpRequest.getRemoteAddr();
        String email = request.getEmail();

        // 로그인 시도 로그
        logsService.createLog(new LogsDto(
            null,
            null,
            null,
            "LOGIN_ATTEMPT",
            "로그인 시도: " + email,
            ip
        ));

        try {
            LoginResponse response = authenticationService.login(email, request.getPassword());

            if (response.isAdmin()) {
                AccountDto account = response.getAccount();  // ← 여기서 꺼내고
                CustomUserDetails userDetails =
                    (CustomUserDetails) userDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
                httpRequest.getSession(true);

                // 관리자 로그인 성공 로그
                logsService.createLog(new LogsDto(
                    null,
                    account.getId(),      // ← response.getAccount().getId()
                    null,
                    "LOGIN_SUCCESS_ADMIN",
                    "관리자 로그인 성공: " + email,
                    ip
                ));

                return ResponseEntity.ok("관리자 로그인 성공");

            } else {
                // JWT 유저 로그인 성공 로그
                logsService.createLog(new LogsDto(
                    null,
                    response.getAccount().getId(),
                    null,
                    "LOGIN_SUCCESS_USER",
                    "JWT 유저 로그인 성공: " + email,
                    ip
                ));

                // (세션 무효화 및 토큰 응답 부분 생략)
                return ResponseEntity.ok(new JwtLoginResponse(
                    response.getAccessToken(),
                    response.getRefreshToken()
                ));
            }

        } catch (Exception e) {
            // 로그인 실패 로그
            logsService.createLog(new LogsDto(
                null,
                null,
                null,
                "LOGIN_FAILURE",
                "로그인 실패: " + email + " (" + e.getMessage() + ")",
                ip
            ));
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    /** 로그아웃 API */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
        @RequestBody(required = false) LogoutRequest request,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse
    ) {
        String ip = httpRequest.getRemoteAddr();
        boolean isAdmin = false;
        Long    accountId = null;
        String  action, description;

        try {
            if (request != null && request.getAccessToken() != null) {
                // — JWT 유저 로그아웃 —
                if (!jwtTokenProvider.validateToken(request.getAccessToken())) {
                    return ResponseEntity.badRequest().body("유효하지 않은 토큰입니다.");
                }
                accountId = jwtTokenProvider.getAccountId(request.getAccessToken());
                AccountDto account = accountMapper.selectById(accountId);
                isAdmin = account.getIsAdmin();

                authenticationService.logout(
                    accountId,
                    request.getRefreshToken(),
                    request.getAccessToken(),
                    isAdmin,
                    httpRequest
                );
                action      = "LOGOUT_USER";
                description = "JWT 유저 로그아웃: accountId=" + accountId;
            } else {
                // — 관리자 세션 로그아웃 —
                isAdmin = true;
                authenticationService.logout(null, null, null, true, httpRequest);
                action      = "LOGOUT_ADMIN";
                description = "관리자 세션 로그아웃";
            }

            if (isAdmin) {
                javax.servlet.http.Cookie cookie = new javax.servlet.http.Cookie("JSESSIONID", "");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                cookie.setHttpOnly(true);
                httpResponse.addCookie(cookie);
            }

            // 로그아웃 성공 로그
            logsService.createLog(new LogsDto(
                null,
                accountId,
                null,
                action,
                description,
                ip
            ));

            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            // 로그아웃 실패 로그
            logsService.createLog(new LogsDto(
                null,
                accountId,
                null,
                "LOGOUT_FAILURE",
                "로그아웃 실패: " + (accountId != null ? accountId : "unknown")
                  + " (" + e.getMessage() + ")",
                ip
            ));
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
