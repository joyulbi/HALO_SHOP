package com.company.haloshop.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.LogsDto;

/**
 * logs 테이블 관련 DB 접근 매퍼 인터페이스
 */
@Mapper
public interface LogsMapper {

    /**
     * ID로 로그 조회
     * @param id 로그 고유 ID
     * @return LogsDto 객체
     */
    LogsDto selectById(@Param("id") Long id);

    /**
     * 모든 로그 목록 조회
     * @return LogsDto 리스트
     */
    List<LogsDto> selectAll();

    /**
     * 로그 데이터 삽입
     * @param log 삽입할 LogsDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertLog(LogsDto log);

    /**
     * 로그 데이터 수정
     * @param log 수정할 LogsDto 객체
     * @return 수정 성공 행 개수
     */
    int updateLog(LogsDto log);

    /**
     * ID 기준 로그 삭제
     * @param id 삭제할 로그 ID
     * @return 삭제 성공 행 개수
     */
    int deleteById(@Param("id") Long id);
}
