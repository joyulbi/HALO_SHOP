package com.company.haloshop.dto.security;

public class LogoutRequest {
    private Long accountId;
    private String refreshToken;
    private String accessToken;
    
    // 기본 생성자, getter, setter 꼭 생성
    public LogoutRequest() {}

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

	public String getAccessToken() { return accessToken; }
	public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
}

