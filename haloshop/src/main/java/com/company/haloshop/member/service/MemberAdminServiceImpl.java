package com.company.haloshop.member.service;

import org.springframework.stereotype.Service;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;

@Service
public class MemberAdminServiceImpl implements MemberAdminService {

    private final AccountMapper accountMapper;
    private final AdminMapper adminMapper;

    public MemberAdminServiceImpl(AccountMapper accountMapper, AdminMapper adminMapper) {
        this.accountMapper = accountMapper;
        this.adminMapper = adminMapper;
    }

    @Override
    public AccountDto getAccountById(Long id) {
        return accountMapper.selectById(id);
    }

    @Override
    public AdminDto getAdminByAccountId(Long accountId) {
        return adminMapper.selectByAccountId(accountId);
    }
}
