package com.company.haloshop.config;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;
import java.util.stream.IntStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
// import org.springframework.security.crypto.argon2.Argon2PasswordEncoder; // 더 이상 직접 생성하지 않으므로 제거
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // 더 이상 직접 생성하지 않으므로 제거
import org.springframework.security.crypto.password.PasswordEncoder; // PasswordEncoder 인터페이스 임포트
import org.springframework.stereotype.Component;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.SocialDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.member.UserStatusDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.member.mapper.SocialMapper;
import com.company.haloshop.member.mapper.UserMapper;
import com.company.haloshop.member.mapper.UserStatusMapper;
import com.company.haloshop.security.Role;

@Component
@Order(3)
public class DummyDataLoader implements CommandLineRunner {

    private final AccountMapper accountMapper;
    private final UserMapper userMapper;
    private final AdminMapper adminMapper;
    private final SocialMapper socialMapper;
    private final UserStatusMapper userStatusMapper;

    // SecurityConfig에서 @Bean으로 정의된 PasswordEncoder 빈을 주입받습니다.
    private final PasswordEncoder userPasswordEncoder; // BCryptPasswordEncoder
    private final PasswordEncoder adminPasswordEncoder; // Argon2PasswordEncoder

    public DummyDataLoader(AccountMapper accountMapper, UserMapper userMapper, AdminMapper adminMapper,
                           SocialMapper socialMapper, UserStatusMapper userStatusMapper,
                           // SecurityConfig에서 @Bean으로 정의한 두 PasswordEncoder를 주입
                           // 빈 이름이 모호할 경우 @Qualifier를 사용할 수 있으나,
                           // 보통은 타입으로 잘 찾음
                           PasswordEncoder userPasswordEncoder,
                           PasswordEncoder adminPasswordEncoder) {
        this.accountMapper = accountMapper;
        this.userMapper = userMapper;
        this.adminMapper = adminMapper;
        this.socialMapper = socialMapper;
        this.userStatusMapper = userStatusMapper;
        this.userPasswordEncoder = userPasswordEncoder;
        this.adminPasswordEncoder = adminPasswordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DummyDataLoader is running...");
        createAdminDummyData();
        createUserDummyData();
    }

    private void createAdminDummyData() {
        createAdminIfNotExists("admin0@gmail.com", "마스터 관리자", Role.MASTER_ADMIN.getStartId());
        createAdminIfNotExists("admin1@gmail.com", "보안 관리자", Role.SECURITY_ADMIN.getStartId());
        createAdminIfNotExists("admin2@gmail.com", "유저 관리자", Role.USER_ADMIN.getStartId());
        createAdminIfNotExists("admin3@gmail.com", "상품 관리자", Role.PRODUCT_MANAGER.getStartId());
        createAdminIfNotExists("admin4@gmail.com", "멤버십 관리자", Role.MEMBERSHIP_MANAGER.getStartId());
        createAdminIfNotExists("admin5@gmail.com", "리뷰 관리자", Role.REVIEW_MANAGER.getStartId());
        createAdminIfNotExists("admin6@gmail.com", "문의 관리자", Role.INQUIRY_MANAGER.getStartId());
    }

    private void createAdminIfNotExists(String email, String nickname, int roleId) {
        AccountDto existingAccount = accountMapper.selectByEmail(email);
        if (existingAccount != null) {
            System.out.println("Admin account already exists: " + email);
            return;
        }

        Integer socialIdForAdmin = 1;
        Integer userStatusIdForAdmin = 1;

        AccountDto account = new AccountDto();
        account.setEmail(email);
        account.setNickname(nickname);
        account.setIsAdmin(true);
        // SecurityConfig에서 정의한 adminPasswordEncoder 빈을 사용합니다.
        account.setPassword(adminPasswordEncoder.encode("1234")); // 수정됨
        account.setCreatedAt(new Date());
        account.setSocialId(socialIdForAdmin);
        account.setUserStatusId(userStatusIdForAdmin);
        accountMapper.insertAccount(account);

        AdminDto admin = new AdminDto();
        admin.setAccountId(account.getId());
        admin.setRole(roleId);
        admin.setIsLocked(false);
        admin.setAssignedBy(account.getId());
        admin.setLastIp("127.0.0.1");
        admin.setUpdatedAt(new Date());
        adminMapper.insertAdmin(admin);

        System.out.println("Inserted admin: " + email + " with role " + roleId);
    }

    private void createUserDummyData() {
        Integer socialIdForUser = 1;
        Integer userStatusIdForUser = 1;

        IntStream.rangeClosed(1, 50).forEach(i -> {
            String email = "user" + i + "@gmail.com";
            AccountDto existingAccount = accountMapper.selectByEmail(email);
            if (existingAccount != null) {
                System.out.println("User account already exists: " + email);
                return;
            }

            AccountDto account = new AccountDto();
            account.setEmail(email);
            account.setNickname("유저" + i);
            account.setIsAdmin(false);
            // SecurityConfig에서 정의한 userPasswordEncoder 빈을 사용합니다.
            account.setPassword(userPasswordEncoder.encode("1234")); // 수정됨
            account.setCreatedAt(new Date());
            account.setSocialId(socialIdForUser);
            account.setUserStatusId(userStatusIdForUser);
            accountMapper.insertAccount(account);

            UserDto user = new UserDto();
            user.setAccountId(account.getId());
            user.setAddress("서울시 강남구");
            user.setAddressDetail("빌딩 " + i + "층");
            user.setZipcode(12345);

            LocalDate localDate = LocalDate.of(1990, 1, 1);
            Date birthDate = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            user.setBirth(birthDate);

            user.setGender(i % 2 == 0 ? "M" : "F");
            userMapper.insertUser(user);

            System.out.println("Inserted user: " + email);
        });
    }
}