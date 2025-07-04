package com.company.haloshop.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.AdminDto;

/**
 * Admin 테이블 관련 DB 접근 매퍼 인터페이스
 * - CRUD 기본 작업 수행
 * - MyBatis 매퍼 XML과 매핑됨
 */
@Mapper
public interface AdminMapper {

    /**
     * account_id로 Admin 조회
     * @param accountId account 고유 ID
     * @return AdminDto 객체
     */
    AdminDto selectByAccountId(@Param("accountId") Long accountId);

    /**
     * 모든 Admin 목록 조회
     * @return AdminDto 리스트
     */
    List<AdminDto> selectAll();

    /**
     * Admin 데이터 삽입
     * @param admin 삽입할 AdminDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertAdmin(AdminDto admin);

    /**
     * Admin 데이터 수정
     * @param admin 수정할 AdminDto 객체
     * @return 수정 성공 행 개수
     */
    int updateAdmin(AdminDto admin);

    /**
     * account_id 기준 Admin 삭제
     * @param accountId 삭제할 Admin의 account_id
     * @return 삭제 성공 행 개수
     */
    int deleteByAccountId(@Param("accountId") Long accountId);
    
    /**
     * updated_at만 갱신
     */
    int updateAdminTimestamp(@Param("accountId") Long accountId, @Param("updatedAt") java.util.Date updatedAt);

}
