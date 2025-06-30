package com.company.haloshop.security.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.security.JwtBlacklistDto;

/**
 * jwt_blacklist 테이블 관련 DB 접근 매퍼 인터페이스
 */
@Mapper
public interface JwtBlacklistMapper {

    /**
     * ID로 JWT 블랙리스트 조회
     * @param id 블랙리스트 ID
     * @return JwtBlacklistDto 객체
     */
    JwtBlacklistDto selectById(@Param("id") Long id);

    /**
     * 모든 JWT 블랙리스트 조회
     * @return JwtBlacklistDto 리스트
     */
    List<JwtBlacklistDto> selectAll();

    /**
     * JWT 블랙리스트 삽입
     * @param blacklist 삽입할 JwtBlacklistDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertBlacklist(JwtBlacklistDto blacklist);

    /**
     * JWT 블랙리스트 수정
     * @param blacklist 수정할 JwtBlacklistDto 객체
     * @return 수정 성공 행 개수
     */
    int updateBlacklist(JwtBlacklistDto blacklist);

    /**
     * ID 기준 JWT 블랙리스트 삭제
     * @param id 삭제할 블랙리스트 ID
     * @return 삭제 성공 행 개수
     */
    int deleteById(@Param("id") Long id);

    /**
     * 특정 계정의 모든 블랙리스트 토큰 삭제
     * @param accountId 계정 ID
     * @return 삭제 성공 행 개수
     */
    int deleteAllByAccountId(@Param("accountId") Long accountId);
}
