package com.company.haloshop.member.service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.AdminUpdateRequest;

public interface MemberAdminService {
    AccountDto getAccountById(Long id); // 계정 정보
    AdminDto getAdminByAccountId(Long accountId); // 어드민 정보
    void updateAdminAccount(AdminUpdateRequest request);
}
