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
     * 승격 처리
     */
    public void promoteToAdmin(Long masterAdminId, Long targetAccountId, int role, String newPassword, String email, String lastIp) {

        // 1. 마스터 관리자 존재 여부 및 권한 확인
        AccountDto masterAdmin = accountMapper.selectById(masterAdminId);
        if (masterAdmin == null || !masterAdmin.getIsAdmin()) {
            throw new RuntimeException("마스터 관리자 권한이 없습니다.");
        }

        // 2. 승격 대상 유저 존재 확인
        AccountDto targetUser = accountMapper.selectById(targetAccountId);
        if (targetUser == null) {
            throw new RuntimeException("승격 대상 유저가 존재하지 않습니다.");
        }

        // 3. 비밀번호 암호화
        String encodedPassword = argon2PasswordEncoder.encode(newPassword);

        // 4. 이메일 값 업데이트
        targetUser.setEmail(email); // 전달받은 email 값을 세팅

        // 5. role 설정
        targetUser.setIsAdmin(true);  // 어드민 승격

        // 6. Account 업데이트
        targetUser.setPassword(encodedPassword);
        accountMapper.updateAccount(targetUser);

        // 7. Admin 테이블에 권한 업데이트
        AdminDto adminDto = new AdminDto();
        adminDto.setAccountId(targetAccountId);
        adminDto.setRole(role); // 승격할 role
        adminDto.setAssignedBy(masterAdminId);
        adminDto.setLastIp(lastIp);
        adminDto.setUpdatedAt(new java.util.Date());
        adminDto.setIsLocked(false); // 잠금 여부

        // 8. Admin 테이블에 정보 삽입/수정
        insertOrUpdateAdmin(adminDto);
    }

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
