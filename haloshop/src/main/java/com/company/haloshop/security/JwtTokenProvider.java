package com.company.haloshop.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // 비밀 키 (환경변수나 외부 설정으로 관리 권장)
    private String secretKey = "your-very-long-secret-key-that-should-be-at-least-256-bits";

    private Key key;

    // Access Token 유효기간 (예: 15분)
    private long accessTokenValidityInMilliseconds = 15 * 60 * 1000L;

    // Refresh Token 유효기간 (예: 7일)
    private long refreshTokenValidityInMilliseconds = 7 * 24 * 60 * 60 * 1000L;

    @PostConstruct
    protected void init() {
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Access Token 생성
    public String createAccessToken(String email, Long accountId) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("accountId", accountId); // accountId 추가
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Refresh Token 생성
    public String createRefreshToken(String email) {
        Claims claims = Jwts.claims().setSubject(email);
        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshTokenValidityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰에서 이메일 추출
    public String getEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 토큰에서 accountId 추출
    public Long getAccountId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("accountId", Long.class);
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // 로그 등으로 예외 처리 가능
            return false;
        }
    }

    // HTTP 요청에서 토큰 추출 (Authorization 헤더: "Bearer <token>")
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    
    // 토큰에서 발행일 반환
    public Date getIssuedAt(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getIssuedAt();
    }

    // 토큰에서 만료일 반환
    public Date getExpiration(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getExpiration();
    }
}