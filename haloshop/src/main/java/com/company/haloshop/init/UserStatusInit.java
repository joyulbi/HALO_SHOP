package com.company.haloshop.init;

import java.util.Arrays;
import java.util.List; // List 임포트 추가

import org.springframework.boot.CommandLineRunner; // ApplicationRunner 대신 CommandLineRunner 임포트
import org.springframework.stereotype.Component; // @Configuration 대신 @Component 임포트
import org.springframework.core.annotation.Order;

import com.company.haloshop.dto.member.UserStatusDto;
import com.company.haloshop.member.mapper.UserStatusMapper;

@Component // <-- @Configuration 대신 @Component로 변경
@Order(2)
public class UserStatusInit implements CommandLineRunner { // <-- ApplicationRunner 대신 CommandLineRunner 구현

    private final UserStatusMapper userStatusMapper;

    public UserStatusInit(UserStatusMapper userStatusMapper) {
        this.userStatusMapper = userStatusMapper;
    }

    @Override // <-- CommandLineRunner 인터페이스의 run 메서드를 오버라이드
    public void run(String... args) throws Exception {
        System.out.println("UserStatusInit is running..."); // <-- 실행 확인을 위한 로그 추가

        // 중복 삽입 방지 로직
        // Arrays.asList()로 생성된 리스트는 List<UserStatusDto> 타입입니다.
        List<UserStatusDto> defaultUserStatuses = Arrays.asList(
            new UserStatusDto(1, 1), // ID 1, 상태 값 1 (정상 계정)
            new UserStatusDto(2, 2), // ID 2, 상태 값 2 (탈퇴 계정)
            new UserStatusDto(3, 3), // ID 3, 상태 값 3 (정지 계정)
            new UserStatusDto(4, 4)  // ID 4, 상태 값 4 (휴면 계정)
        );

        for (UserStatusDto status : defaultUserStatuses) {
            UserStatusDto found = userStatusMapper.selectById(status.getId());
            if (found == null) {
                userStatusMapper.insertUserStatus(status);
                System.out.println("Inserted user status: ID=" + status.getId() + ", Status Value=" + status.getStatus());
            } else {
                System.out.println("User status already exists: ID=" + found.getId() + ", Status Value=" + found.getStatus());
            }
        }
        System.out.println("UserStatusInit - User status data initialization complete.");
    }
}