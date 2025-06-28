package com.company.haloshop.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.UserDto;

/**
 * User 테이블 관련 DB 접근 매퍼 인터페이스
 * - CRUD 기본 작업 수행
 * - MyBatis 매퍼 XML과 매핑됨
 */
@Mapper
public interface UserMapper {

    /**
     * account_id로 User 조회
     * @param accountId account 고유 ID
     * @return UserDto 객체
     */
    UserDto selectByAccountId(@Param("accountId") Long accountId);

    /**
     * 모든 User 목록 조회
     * @return UserDto 리스트
     */
    List<UserDto> selectAll();

    /**
     * User 데이터 삽입
     * @param user 삽입할 UserDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertUser(UserDto user);

    /**
     * User 데이터 수정
     * @param user 수정할 UserDto 객체
     * @return 수정 성공 행 개수
     */
    int updateUser(UserDto user);

    /**
     * account_id 기준 User 삭제
     * @param accountId 삭제할 User의 account_id
     * @return 삭제 성공 행 개수
     */
    int deleteByAccountId(@Param("accountId") Long accountId);
}
