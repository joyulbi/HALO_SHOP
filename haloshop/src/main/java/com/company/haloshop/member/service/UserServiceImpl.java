package com.company.haloshop.member.service;

import org.springframework.stereotype.Service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService {

    private final AccountMapper accountMapper;
    private final UserMapper userMapper;

    public UserServiceImpl(AccountMapper accountMapper, UserMapper userMapper) {
        this.accountMapper = accountMapper;
        this.userMapper = userMapper;
    }

    @Override
    public AccountDto getAccountById(Long id) {
        return accountMapper.selectById(id);
    }

    @Override
    public UserDto getUserByAccountId(Long accountId) {
        return userMapper.selectByAccountId(accountId);
    }
}
