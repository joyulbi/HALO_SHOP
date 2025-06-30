package com.company.haloshop.init;

import java.util.Arrays;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.company.haloshop.dto.member.UserStatusDto;
import com.company.haloshop.member.mapper.UserStatusMapper;

@Configuration
public class UserStatusInit {

    private final UserStatusMapper userStatusMapper;

    public UserStatusInit(UserStatusMapper userStatusMapper) {
        this.userStatusMapper = userStatusMapper;
    }

    @Bean
    public ApplicationRunner userStatusInitRunner() {
        return args -> {
            // 중복 삽입 방지
            for (UserStatusDto status : Arrays.asList(
                    new UserStatusDto(1, 1), // 정상 계정
                    new UserStatusDto(2, 2), // 탈퇴 계정
                    new UserStatusDto(3, 3), // 정지 계정
                    new UserStatusDto(4, 4)  // 휴면 계정
            )) {
                UserStatusDto found = userStatusMapper.selectById(status.getId());
                if (found == null) {
                    userStatusMapper.insertUserStatus(status);
                }
            }
        };
    }
}
