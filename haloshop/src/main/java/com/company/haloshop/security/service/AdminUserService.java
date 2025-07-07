// src/main/java/com/company/haloshop/security/service/AdminUserService.java
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

    /**
     * 1) 유저 리스트 조회 (페이징 + 검색)
     * @param page     0부터 시작하는 페이지 번호
     * @param size     페이지 당 아이템 개수
     * @param email    (선택) 이메일 검색 키워드
     * @param nickname (선택) 닉네임 검색 키워드
     * @param statusDto (선택) 상태 DTO
     * @return 페이징 처리된 AccountDto 페이지
     */
    Page<AccountDto> getUserList(int page, int size, String email, String nickname, UserStatusDto statusDto);

    /**
     * 2) 단일 계정 정보 조회
     * @param accountId 조회할 계정 ID
     */
    AccountDto getAccount(Long accountId);

    /**
     * 3) 단일 유저 프로필(UserDto) 조회
     * @param accountId 조회할 계정 ID
     */
    UserDto getUserProfile(Long accountId);

    /**
     * 4) 단일 관리자 정보(AdminDto) 조회
     * @param accountId 조회할 계정 ID
     */
    AdminDto getAdminDetail(Long accountId);

    /**
     * 5) 유저 정보 수정
     * @param accountId 수정할 계정 ID
     * @param req       수정 요청 파라미터
     */
    void updateUser(Long accountId, UserUpdateRequest req);

    /**
     * 6) 유저 상태 변경
     * @param accountId 조회할 계정 ID
     * @param statusDto 변경할 상태 DTO
     */
    void changeStatus(Long accountId, UserStatusDto statusDto);
}
