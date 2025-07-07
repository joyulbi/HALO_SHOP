package com.company.haloshop.member.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.AccountDto;

/**
 * Account 테이블 관련 DB 접근 매퍼 인터페이스
 * - CRUD 기본 작업 수행
 * - MyBatis 매퍼 XML과 매핑됨
 */
@Mapper
public interface AccountMapper {

    /**
     * ID로 Account 조회
     * @param id Account의 고유 ID
     * @return 조회된 AccountDto 객체
     */
    AccountDto selectById(@Param("id") Long id);

    /**
     * 이메일로 Account 조회
     * @param email 조회할 이메일
     * @return 조회된 AccountDto 객체
     */
    AccountDto selectByEmail(@Param("email") String email);

    /**
     * 모든 Account 목록 조회
     * @return AccountDto 객체 리스트
     */
    List<AccountDto> selectAll();

    /**
     * 새로운 Account 데이터 삽입
     * @param account 삽입할 AccountDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertAccount(AccountDto account);

    /**
     * 기존 Account 데이터 수정 (모든 필드를 통째로 업데이트)
     * @param account 수정할 AccountDto 객체
     * @return 수정 성공 행 개수
     */
    int updateAccount(AccountDto account);

    /**
     * 변경 가능한 필드만 업데이트
     * - SQL 매퍼 XML 쪽에서 각 필드별로 null 체크 후 SET 절에 추가
     * @param accountDto 수정할 AccountDto 객체
     * @return 수정 성공 행 개수
     */
    int updateAccountFields(AccountDto accountDto);

    /**
     * ID 기준 Account 데이터 삭제
     * @param id 삭제할 Account의 고유 ID
     * @return 삭제 성공 행 개수
     */
    int deleteById(@Param("id") Long id);

    /**
     * 마지막 활동 시간만 업데이트
     * @param accountId Account의 고유 ID
     * @param lastActive 업데이트할 마지막 활동 일시
     * @return 수정 성공 행 개수
     */
    int updateAccountLastActive(@Param("accountId") Long accountId,
                                @Param("lastActive") Date lastActive);
}
