package com.company.haloshop.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.DeleteUsersDto;

/**
 * DeleteUsers 테이블 관련 DB 접근 매퍼 인터페이스
 */
@Mapper
public interface DeleteUsersMapper {

    /**
     * account_id로 DeleteUsers 조회
     * @param accountId 삭제 대상 account ID
     * @return DeleteUsersDto 객체
     */
    DeleteUsersDto selectByAccountId(@Param("accountId") Long accountId);

    /**
     * 모든 DeleteUsers 목록 조회
     * @return DeleteUsersDto 리스트
     */
    List<DeleteUsersDto> selectAll();

    /**
     * DeleteUsers 데이터 삽입
     * @param deleteUsers 삽입할 DeleteUsersDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertDeleteUsers(DeleteUsersDto deleteUsers);

    /**
     * DeleteUsers 데이터 수정
     * @param deleteUsers 수정할 DeleteUsersDto 객체
     * @return 수정 성공 행 개수
     */
    int updateDeleteUsers(DeleteUsersDto deleteUsers);

    /**
     * account_id 기준 DeleteUsers 삭제
     * @param accountId 삭제 대상 account ID
     * @return 삭제 성공 행 개수
     */
    int deleteByAccountId(@Param("accountId") Long accountId);
}
