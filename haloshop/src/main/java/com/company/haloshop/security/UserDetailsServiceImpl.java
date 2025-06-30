package com.company.haloshop.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.member.mapper.AccountMapper;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AccountMapper accountMapper;

    public UserDetailsServiceImpl(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AccountDto account = accountMapper.selectByEmail(email);
        if (account == null || account.getIsAdmin()) {
            throw new UsernameNotFoundException("User not found or is admin");
        }
        return new CustomUserDetails(account);
    }
}
