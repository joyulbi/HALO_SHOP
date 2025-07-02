package com.company.haloshop.member.service;

import org.springframework.stereotype.Service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;


public interface UserService {
    AccountDto getAccountById(Long id);
    UserDto getUserByAccountId(Long accountId);
}
