package com.company.haloshop.dto.security;

public class PromoteRequest {
    private Long targetAccountId;   // 승격 대상 계정 ID
    private int role;               // 새로운 역할 ID
    private Long assignedBy;        // 승격을 수행한 관리자 ID
    private String lastIp;          // 승격을 진행한 클라이언트의 IP 주소
    private String newPassword;     // 새로운 비밀번호
    private String email;           // 새로 추가된 email 값

    // Getters and Setters
    public Long getTargetAccountId() {
        return targetAccountId;
    }

    public void setTargetAccountId(Long targetAccountId) {
        this.targetAccountId = targetAccountId;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    public Long getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(Long assignedBy) {
        this.assignedBy = assignedBy;
    }

    public String getLastIp() {
        return lastIp;
    }

    public void setLastIp(String lastIp) {
        this.lastIp = lastIp;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
