package com.company.haloshop.security.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.security.JwtWhitelistDto;

/**
 * jwt_whitelist 테이블 관련 DB 접근 매퍼 인터페이스
 */
@Mapper
public interface JwtWhitelistMapper {

    /**
     * ID로 JWT 화이트리스트 조회
     * @param id 화이트리스트 ID
     * @return JwtWhitelistDto 객체
     */
    JwtWhitelistDto selectById(@Param("id") Long id);

    /**
     * 모든 JWT 화이트리스트 조회
     * @return JwtWhitelistDto 리스트
     */
    List<JwtWhitelistDto> selectAll();

    /**
     * JWT 화이트리스트 삽입
     * @param whitelist 삽입할 JwtWhitelistDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertWhitelist(JwtWhitelistDto whitelist);

    /**
     * JWT 화이트리스트 수정
     * @param whitelist 수정할 JwtWhitelistDto 객체
     * @return 수정 성공 행 개수
     */
    int updateWhitelist(JwtWhitelistDto whitelist);

    /**
     * ID 기준 JWT 화이트리스트 삭제
     * @param id 삭제할 화이트리스트 ID
     * @return 삭제 성공 행 개수
     */
    int deleteById(@Param("id") Long id);

    /**
     * 특정 계정의 모든 화이트리스트 토큰 삭제
     * @param accountId 계정 ID
     * @return 삭제 성공 행 개수
     */
    int deleteAllByAccountId(@Param("accountId") Long accountId);
    
    int deactivateToken(@Param("accountId") Long accountId, @Param("refreshToken") String refreshToken);

}
