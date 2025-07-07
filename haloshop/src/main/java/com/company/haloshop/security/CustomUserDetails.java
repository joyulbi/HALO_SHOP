package com.company.haloshop.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.company.haloshop.dto.member.AccountDto;

/**
 * Spring Security가 사용하는 사용자 정보 클래스
 * - AccountDto를 래핑하여 UserDetails로 노출
 * - 세션 기반(admin)과 JWT 기반(user) 모두 같은 UserDetails 사용
 */
public class CustomUserDetails implements UserDetails {

    private final AccountDto account;

    public CustomUserDetails(AccountDto account) {
        this.account = account;
    }

    /**
     * 계정의 권한 설정
     * - isAdmin == true 이면 ROLE_ADMIN
     * - 아니면 ROLE_USER
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (Boolean.TRUE.equals(account.getIsAdmin())) {
            return Collections.singleton(() -> "ROLE_ADMIN");
        }
        return Collections.singleton(() -> "ROLE_USER");
    }

    @Override
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        return account.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // 필요시 AccountDto 상태값으로 로직 추가 가능
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // 필요시 AccountDto 상태값으로 로직 추가 가능
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // 필요시 정책에 따른 로직 추가 가능
    }

    @Override
    public boolean isEnabled() {
        return true;  // 필요시 이메일 인증 여부 등으로 로직 추가 가능
    }

    // ================================================
    // ↓ 아래 추가 메서드들로 AdminCheck 등에서 AccountDto에 접근
    // ================================================

    /** AccountDto 전체 객체를 꺼내올 때 사용 */
    public AccountDto getAccountDto() {
        return this.account;
    }

    /** AccountDto의 ID를 바로 꺼내올 때 편의 메서드 */
    public Long getId() {
        return account.getId();
    }

    /** 계정이 관리자(isAdmin=true)인지 여부 반환 */
    public boolean isAdmin() {
        return Boolean.TRUE.equals(account.getIsAdmin());
    }

    /** 마지막 활성화 시간 반환 */
    public java.util.Date getLastActive() {
        return account.getLastActive();
    }

    /** 생성일시 반환 */
    public java.util.Date getCreatedAt() {
        return account.getCreatedAt();
    }

    /** 기타 필요한 AccountDto 필드 접근용 getter 추가 가능 */
}
