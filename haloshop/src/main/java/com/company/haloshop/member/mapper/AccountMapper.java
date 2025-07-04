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
     * 기존 Account 데이터 수정
     * @param account 수정할 AccountDto 객체
     * @return 수정 성공 행 개수
     */
    int updateAccount(AccountDto account);

    /**
     * ID 기준 Account 데이터 삭제
     * @param id 삭제할 Account의 고유 ID
     * @return 삭제 성공 행 개수
     */
    int deleteById(@Param("id") Long id);
    
    int updateAccountLastActive(Long accountId, Date lastActive);
    int updateAccountFields(AccountDto accountDto);
}
