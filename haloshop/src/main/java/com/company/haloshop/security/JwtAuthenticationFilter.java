package com.company.haloshop.security;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.company.haloshop.security.mapper.JwtBlacklistMapper;
import com.company.haloshop.security.UserDetailsServiceImpl;

import java.io.IOException;

/**
 * JWT 인증 필터
 * 요청의 Authorization 헤더에서 JWT 토큰을 추출하여 유효성을 검사하고,
 * 유효한 경우 SecurityContextHolder에 인증 정보를 설정
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtBlacklistMapper jwtBlacklistMapper;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserDetailsServiceImpl userDetailsService, JwtBlacklistMapper jwtBlacklistMapper) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
        this.jwtBlacklistMapper = jwtBlacklistMapper;
    }

    /**
     * 요청 필터링
     * @param request HTTP 요청
     * @param response HTTP 응답
     * @param filterChain 필터 체인
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // Authorization 헤더에서 토큰 추출
        String token = jwtTokenProvider.resolveToken(request);

        // 토큰이 존재하고, 유효하며, 블랙리스트에 없으면 인증 처리
        if (token != null && jwtTokenProvider.validateToken(token) && jwtBlacklistMapper.isTokenBlacklisted(token) == 0) {
            String email = jwtTokenProvider.getEmail(token);
            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(email);

            // 관리자(isAdmin=true)면 JWT 인증 스킵 (세션 인증 사용)
            if (userDetails.isAdmin()) {
                filterChain.doFilter(request, response);
                return;
            }

            // 일반 유저 JWT 인증 처리
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}