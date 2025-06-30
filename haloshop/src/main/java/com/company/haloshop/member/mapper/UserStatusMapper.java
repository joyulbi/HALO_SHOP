package com.company.haloshop.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.UserStatusDto;

/**
 * UserStatus 테이블 관련 DB 접근 매퍼 인터페이스
 */
@Mapper
public interface UserStatusMapper {

    /**
     * ID로 UserStatus 조회
     * @param id 상태 ID
     * @return UserStatusDto 객체
     */
    UserStatusDto selectById(@Param("id") Integer id);

    /**
     * 모든 UserStatus 목록 조회
     * @return UserStatusDto 리스트
     */
    List<UserStatusDto> selectAll();

    /**
     * UserStatus 데이터 삽입
     * @param userStatus 삽입할 UserStatusDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertUserStatus(UserStatusDto userStatus);

    /**
     * UserStatus 데이터 수정
     * @param userStatus 수정할 UserStatusDto 객체
     * @return 수정 성공 행 개수
     */
    int updateUserStatus(UserStatusDto userStatus);

    /**
     * ID 기준 UserStatus 삭제
     * @param id 삭제할 상태 ID
     * @return 삭제 성공 행 개수
     */
    int deleteById(@Param("id") Integer id);
}
