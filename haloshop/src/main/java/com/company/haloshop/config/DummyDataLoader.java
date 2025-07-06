package com.company.haloshop.config;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.stream.IntStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.member.mapper.UserMapper;
import com.company.haloshop.security.Role;

/**
 * 애플리케이션 시작 시 더미 데이터를 로드하는 컴포넌트
 * - 관리자 계정 생성
 * - 일반 사용자 계정 50개 생성
 * - PasswordEncoder 빈 주입 받아 암호 해싱 처리
 */
@Component
@Order(3)
public class DummyDataLoader implements CommandLineRunner {

    private final AccountMapper accountMapper;
    private final AdminMapper adminMapper;
    private final UserMapper userMapper;
    private final PasswordEncoder userPasswordEncoder;   // BCryptPasswordEncoder 빈
    private final PasswordEncoder adminPasswordEncoder;  // Argon2PasswordEncoder 빈

    public DummyDataLoader(AccountMapper accountMapper,
                           AdminMapper adminMapper,
                           UserMapper userMapper,
                           PasswordEncoder userPasswordEncoder,
                           PasswordEncoder adminPasswordEncoder) {
        this.accountMapper = accountMapper;
        this.adminMapper = adminMapper;
        this.userMapper = userMapper;
        this.userPasswordEncoder = userPasswordEncoder;
        this.adminPasswordEncoder = adminPasswordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println("--- DummyDataLoader 실행 시작 ---");
        // 관리자 더미 데이터 생성
        createAdminDummyData();
        // 일반 사용자 더미 데이터 생성
        createUserDummyData();
        System.out.println("--- DummyDataLoader 실행 완료 ---");
    }

    /**
     * 관리자 계정 더미 데이터 생성 메서드
     * - Role enum 에 정의된 roleId로 계정 및 admin 테이블 생성
     * - 이미 존재하면 생성 건너뜀
     */
    private void createAdminDummyData() {
        createAdminIfNotExists("admin0@gmail.com", "마스터 관리자", Role.MASTER_ADMIN.getRoleId());
        createAdminIfNotExists("admin1@gmail.com", "보안 관리자", Role.SECURITY_ADMIN.getRoleId());
        createAdminIfNotExists("admin2@gmail.com", "유저 관리자", Role.USER_ADMIN.getRoleId());
        createAdminIfNotExists("admin3@gmail.com", "상품 관리자", Role.PRODUCT_MANAGER.getRoleId());
        createAdminIfNotExists("admin4@gmail.com", "멤버십 관리자", Role.MEMBERSHIP_MANAGER.getRoleId());
        createAdminIfNotExists("admin5@gmail.com", "리뷰 관리자", Role.REVIEW_MANAGER.getRoleId());
        createAdminIfNotExists("admin6@gmail.com", "문의 관리자", Role.INQUIRY_MANAGER.getRoleId());
    }

    /**
     * 관리자 계정 생성 헬퍼 메서드
     * @param email 관리자 이메일
     * @param nickname 관리자 닉네임
     * @param roleId Role enum 에 지정된 고유 roleId
     */
    private void createAdminIfNotExists(String email, String nickname, int roleId) {
        // 이미 계정이 존재하는지 확인
        if (accountMapper.selectByEmail(email) != null) {
            System.out.println("[SKIP] 기존 관리자 계정 존재: " + email);
            return;
        }

        // AccountDto 설정
        AccountDto account = new AccountDto();
        account.setEmail(email);
        account.setNickname(nickname);
        account.setIsAdmin(true);  // 관리자 플래그
        account.setPassword(adminPasswordEncoder.encode("1234"));  // Argon2로 암호 해싱
        account.setCreatedAt(new Date());
        account.setSocialId(1);
        account.setUserStatusId(1);
        accountMapper.insertAccount(account);

        // AdminDto 설정
        AdminDto admin = new AdminDto();
        admin.setAccountId(account.getId());
        admin.setRole(roleId);  // enum 기반 단일 roleId
        admin.setIsLocked(false);
        admin.setAssignedBy(account.getId());
        admin.setLastIp("127.0.0.1");
        admin.setUpdatedAt(new Date());
        adminMapper.insertAdmin(admin);

        System.out.println("[INSERT] 관리자 생성: " + email + " (roleId=" + roleId + ")");
    }

    /**
     * 일반 사용자 50명 더미 데이터 생성 메서드
     * - user1 ~ user50 이메일 패턴
     * - BCryptPasswordEncoder로 암호 해싱
     */
    private void createUserDummyData() {
        IntStream.rangeClosed(1, 50).forEach(i -> {
            String email = "user" + i + "@gmail.com";
            if (accountMapper.selectByEmail(email) != null) {
                System.out.println("[SKIP] 기존 사용자 계정 존재: " + email);
                return;
            }

            // AccountDto 설정
            AccountDto account = new AccountDto();
            account.setEmail(email);
            account.setNickname("유저" + i);
            account.setIsAdmin(false);
            account.setPassword(userPasswordEncoder.encode("1234"));  // BCrypt로 암호 해싱
            account.setCreatedAt(new Date());
            account.setSocialId(1);
            account.setUserStatusId(1);
            accountMapper.insertAccount(account);

            // UserDto 설정
            UserDto user = new UserDto();
            user.setAccountId(account.getId());
            user.setAddress("서울시 강남구");
            user.setAddressDetail("빌딩 " + i + "층");
            user.setZipcode(12345);
            // 생년월일 고정: 1990-01-01
            LocalDate birthLocal = LocalDate.of(1990, 1, 1);
            Date birthDate = Date.from(birthLocal.atStartOfDay(ZoneId.systemDefault()).toInstant());
            user.setBirth(birthDate);
            user.setGender(i % 2 == 0 ? "M" : "F");
            userMapper.insertUser(user);

            System.out.println("[INSERT] 일반 사용자 생성: " + email);
        });
    }
}
