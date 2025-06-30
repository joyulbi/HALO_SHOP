package com.company.haloshop.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.SocialDto;

/**
 * Social 테이블 관련 DB 접근 매퍼 인터페이스
 */
@Mapper
public interface SocialMapper {

    /**
     * ID로 Social 조회
     * @param id social ID
     * @return SocialDto 객체
     */
    SocialDto selectById(@Param("id") Integer id);

    /**
     * 모든 Social 목록 조회
     * @return SocialDto 리스트
     */
    List<SocialDto> selectAll();

    /**
     * Social 데이터 삽입
     * @param social 삽입할 SocialDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertSocial(SocialDto social);

    /**
     * Social 데이터 수정
     * @param social 수정할 SocialDto 객체
     * @return 수정 성공 행 개수
     */
    int updateSocial(SocialDto social);

    /**
     * ID 기준 Social 삭제
     * @param id 삭제할 social ID
     * @return 삭제 성공 행 개수
     */
    int deleteById(@Param("id") Integer id);
}
