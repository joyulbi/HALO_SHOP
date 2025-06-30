package com.company.haloshop.dto.security;

/**
 * JWT 로그인 성공 시 반환하는 응답 DTO
 */
public class JwtLoginResponse {
    private String accessToken;
    private String refreshToken;

    public JwtLoginResponse() {}

    public JwtLoginResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public String getAccessToken() {
        return accessToken;
    }
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
