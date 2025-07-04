package com.company.haloshop.member.service;

import org.springframework.stereotype.Service;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.AdminUpdateRequest;
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
    
    @Override
    public void updateAdminAccount(AdminUpdateRequest request) {
        // 1. account 테이블 업데이트
        AccountDto accountDto = new AccountDto();
        accountDto.setId(request.getAccountId());
        accountDto.setEmail(request.getEmail());
        accountDto.setNickname(request.getNickname());
        accountDto.setPhone(request.getPhone());  // ← phone 추가 가능하면
        accountDto.setUpdatedAt(new java.util.Date());  // 현재시간 설정

        accountMapper.updateAccount(accountDto);


    }

}
