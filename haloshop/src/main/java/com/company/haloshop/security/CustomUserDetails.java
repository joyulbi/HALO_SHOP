package com.company.haloshop.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.company.haloshop.dto.member.AccountDto;

public class CustomUserDetails implements UserDetails {

    private final AccountDto account;

    public CustomUserDetails(AccountDto account) {
        this.account = account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한은 ROLE_USER 고정 (필요 시 확장 가능)
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
        return true; // 필요시 상태값 체크
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 필요시 상태값 체크
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 필요시 상태값 체크
    }

    @Override
    public boolean isEnabled() {
        return true; // 필요시 상태값 체크
    }

    public Long getId() {
        return account.getId();
    }
}
