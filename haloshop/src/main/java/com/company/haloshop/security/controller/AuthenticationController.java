package com.company.haloshop.security.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.security.JwtLoginResponse;
import com.company.haloshop.dto.security.LoginRequest;
import com.company.haloshop.dto.security.LogoutRequest;
import com.company.haloshop.dto.security.SignupRequest;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.security.CustomUserDetails;
import com.company.haloshop.security.JwtTokenProvider;
import com.company.haloshop.security.UserDetailsServiceImpl;
import com.company.haloshop.security.service.AuthenticationService;
import com.company.haloshop.security.service.AuthenticationService.LoginResponse;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final AccountMapper accountMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthenticationController(AuthenticationService authenticationService, 
                                    AccountMapper accountMapper,
                                    JwtTokenProvider jwtTokenProvider, UserDetailsServiceImpl userDetailsService) {
        this.authenticationService = authenticationService;
        this.accountMapper = accountMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
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
    
    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        try {
            LoginResponse response = authenticationService.login(request.getEmail(), request.getPassword());

            if (response.isAdmin()) {
                // 세션 관리자의 경우
                CustomUserDetails userDetails =
                    (CustomUserDetails) userDetailsService.loadUserByUsername(response.getAccount().getEmail());
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);

                // 세션 ID를 명시적으로 생성
                httpRequest.getSession(true);

                System.out.println("==== 로그인 직후 세션 체크 ====");
                System.out.println("SessionID: " + httpRequest.getSession().getId());
                System.out.println("Auth: " + SecurityContextHolder.getContext().getAuthentication());
                System.out.println("Principal: " + SecurityContextHolder.getContext().getAuthentication().getPrincipal());
                System.out.println("=================================");

                return ResponseEntity.ok("관리자 로그인 성공");
            } else {
                // JWT 유저의 경우
                if (httpRequest.getSession(false) != null) {
                    httpRequest.getSession(false).invalidate();
                }

                javax.servlet.http.Cookie cookie = new javax.servlet.http.Cookie("JSESSIONID", "");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                cookie.setHttpOnly(true);
                cookie.setSecure(false); 
                httpResponse.addCookie(cookie);

                return ResponseEntity.ok(new JwtLoginResponse(
                    response.getAccessToken(), response.getRefreshToken()
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 로그아웃 API
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
        @RequestBody(required = false) LogoutRequest request,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse
    ) {
        try {
            boolean isAdmin = false;
            Long accountId = null;

            // JWT 유저 로그아웃 처리
            if (request != null && request.getAccessToken() != null) {
                if (!jwtTokenProvider.validateToken(request.getAccessToken())) {
                    return ResponseEntity.badRequest().body("유효하지 않은 토큰입니다.");
                }

                accountId = jwtTokenProvider.getAccountId(request.getAccessToken());
                AccountDto account = accountMapper.selectById(accountId);

                if (account == null) {
                    return ResponseEntity.badRequest().body("존재하지 않는 계정입니다.");
                }

                isAdmin = account.getIsAdmin();
                authenticationService.logout(
                    accountId, request.getRefreshToken(), request.getAccessToken(),
                    isAdmin, httpRequest
                );
            } 
            // 세션 기반 어드민 로그아웃 처리
            else {
                isAdmin = true;
                authenticationService.logout(null, null, null, true, httpRequest);
            }

            // JSESSIONID 쿠키 삭제
            if (isAdmin) {
                javax.servlet.http.Cookie cookie = new javax.servlet.http.Cookie("JSESSIONID", "");
                cookie.setPath("/");
                cookie.setMaxAge(0); // 즉시 만료
                cookie.setHttpOnly(true);
                cookie.setSecure(false); // HTTPS 환경일 경우 true
                httpResponse.addCookie(cookie);
            }

            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}