package com.company.haloshop.security.service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.member.UserStatusDto;
import com.company.haloshop.dto.member.UserUpdateRequest;
import org.springframework.data.domain.Page;

/**
 * 유저 관리자 서비스 인터페이스
 *  - 사용자 및 관리자 계정 조회/수정/상태변경 기능 정의
 */
public interface AdminUserService {

    Page<AccountDto> getUserList(int page, int size, String email, String nickname, UserStatusDto statusDto);

    AccountDto getAccount(Long accountId);

    UserDto getUserProfile(Long accountId);

    /**
     * 관리자 계정일 때만 값이 들어옴, 일반 사용자라면 null
     */
    AdminDto getAdminDetail(Long accountId);

    void updateUser(Long accountId, UserUpdateRequest req);

    void changeStatus(Long accountId, UserStatusDto statusDto);
}
