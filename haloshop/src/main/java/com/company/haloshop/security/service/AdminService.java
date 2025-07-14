package com.company.haloshop.security.service;

import java.util.Date;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.security.Role;

/**
 * 관리자 관련 서비스 클래스
 * - 관리자 승격, 권한 조회, 역할 변경 등의 로직 포함
 */
@Service
public class AdminService {

    private final AccountMapper accountMapper;
    private final AdminMapper adminMapper;
    private final Argon2PasswordEncoder argon2PasswordEncoder;

    /**
     * 생성자 주입 방식으로 의존성 주입
     */
    public AdminService(AccountMapper accountMapper, AdminMapper adminMapper) {
        this.accountMapper = accountMapper;
        this.adminMapper = adminMapper;
        this.argon2PasswordEncoder = new Argon2PasswordEncoder();
    }

    /**
     * 관리자 승격 처리
     * @param masterAdminId 승격을 수행한 마스터 관리자 ID
     * @param targetAccountId 승격 대상 계정 ID
     * @param role 승격할 관리자 역할 ID
     * @param newPassword 새로 설정할 비밀번호
     * @param email 변경할 이메일
     * @param lastIp 승격 요청자의 IP
     */
    public void promoteToAdmin(Long masterAdminId, Long targetAccountId, int role, String newPassword, String email, String lastIp) {

        // 1. 마스터 관리자 권한 확인
        AccountDto masterAdmin = accountMapper.selectById(masterAdminId);
        if (masterAdmin == null || !Boolean.TRUE.equals(masterAdmin.getIsAdmin())) {
            throw new RuntimeException("마스터 관리자 권한이 없습니다.");
        }

        // 2. 대상 유저 존재 확인
        AccountDto targetUser = accountMapper.selectById(targetAccountId);
        if (targetUser == null) {
            throw new RuntimeException("승격 대상 유저가 존재하지 않습니다.");
        }

        // 3. 비밀번호 암호화
        String encodedPassword = argon2PasswordEncoder.encode(newPassword);

        // 4. 계정 정보 업데이트
        targetUser.setPassword(encodedPassword);        // 비밀번호
        targetUser.setEmail(email);                     // 이메일
        targetUser.setIsAdmin(true);                    // 관리자 승격
        accountMapper.updateAccount(targetUser);        // DB 반영

        // 5. Admin 테이블 업데이트
        AdminDto adminDto = new AdminDto();
        adminDto.setAccountId(targetAccountId);         // 계정 ID
        adminDto.setRole(role);                         // 관리자 역할
        adminDto.setAssignedBy(masterAdminId);          // 지정한 관리자
        adminDto.setLastIp(lastIp);                     // IP
        adminDto.setUpdatedAt(new Date());              // 수정 시각
        adminDto.setIsLocked(false);                    // 잠금 여부

        insertOrUpdateAdmin(adminDto);                  // 삽입 or 갱신 처리
    }

    /**
     * admin 테이블에 삽입 또는 수정
     * @param adminDto 관리자 정보 객체
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
     * 특정 관리자 계정의 역할(Role)을 조회
     * @param accountId 계정 ID
     * @return 역할 ID (예: 1=마스터, 2=신고관리자 등)
     */
    public Integer getRoleByAccountId(Long accountId) {
        AdminDto adminDto = adminMapper.selectByAccountId(accountId);
        if (adminDto == null) return null;
        return adminDto.getRole();
    }
}
