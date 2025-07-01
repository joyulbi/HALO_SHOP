package com.company.haloshop.security.service;

import java.util.Date;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.security.Role;

@Service
public class AdminService {

    private final AccountMapper accountMapper;
    private final AdminMapper adminMapper;
    private final Argon2PasswordEncoder argon2PasswordEncoder;

    public AdminService(AccountMapper accountMapper, AdminMapper adminMapper) {
        this.accountMapper = accountMapper;
        this.adminMapper = adminMapper;
        this.argon2PasswordEncoder = new Argon2PasswordEncoder();
    }

    /**
     * 마스터 관리자만 권한 승격 가능
     * 승격 대상 유저의 비밀번호를 argon2로 새로 암호화하여 변경
     * admin 테이블 role 정보 insert or update 처리
     */
    public void promoteToAdmin(Long masterAdminId, Long targetAccountId, int roleId, String newPassword, String lastIp) {

        // 1. 마스터 관리자 account 존재 및 is_admin 체크
        AccountDto masterAdmin = accountMapper.selectById(masterAdminId);
        if (masterAdmin == null || !masterAdmin.getIsAdmin()) {
            throw new RuntimeException("마스터 관리자 권한이 없습니다.");
        }

        // 2. 마스터 관리자 admin 정보 조회 및 role 체크
        AdminDto masterAdminInfo = adminMapper.selectByAccountId(masterAdminId);
        if (masterAdminInfo == null || Role.fromId(masterAdminInfo.getRole()) != Role.MASTER_ADMIN) {
            throw new RuntimeException("마스터 관리자만 권한 승격이 가능합니다.");
        }

        // 3. 승격 대상 유저 존재 확인
        AccountDto targetUser = accountMapper.selectById(targetAccountId);
        if (targetUser == null) {
            throw new RuntimeException("승격 대상 유저가 존재하지 않습니다.");
        }

        // 4. 새 비밀번호 argon2 암호화
        String encodedPassword = argon2PasswordEncoder.encode(newPassword);

        // 5. account 테이블에 password, is_admin 업데이트
        targetUser.setPassword(encodedPassword);
        targetUser.setIsAdmin(true);
        accountMapper.updateAccount(targetUser);

        // 6. admin 테이블에 관리자 정보 insert 또는 update
        AdminDto adminDto = new AdminDto();
        adminDto.setAccountId(targetAccountId);
        adminDto.setRole(roleId);
        adminDto.setAssignedBy(masterAdminId);
        adminDto.setLastIp(lastIp);
        adminDto.setUpdatedAt(new Date());
        adminDto.setIsLocked(false);

        insertOrUpdateAdmin(adminDto);
    }

    /**
     * admin 테이블에 이미 계정이 존재하면 update, 없으면 insert 처리
     */
    private void insertOrUpdateAdmin(AdminDto adminDto) {
        AdminDto existingAdmin = adminMapper.selectByAccountId(adminDto.getAccountId());
        if (existingAdmin == null) {
            adminMapper.insertAdmin(adminDto);
        } else {
            adminMapper.updateAdmin(adminDto);
        }
    }

    /**
     * 주어진 accountId에 대한 Role 객체 반환
     * @param accountId 조회할 관리자 계정 ID
     * @return Role 객체, 없으면 null 반환
     */
    public Integer getRoleByAccountId(Long accountId) {
        AdminDto adminDto = adminMapper.selectByAccountId(accountId);
        if (adminDto == null) {
            return null;
        }
        return adminDto.getRole();
    }


}
