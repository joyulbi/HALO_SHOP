package com.company.haloshop.security.service;

import com.company.haloshop.dto.member.LogsDto;
import java.util.List;

public interface LogsService {
    /**
     * 단일 로그 생성
     */
    void createLog(LogsDto log);

    /**
     * 전체 로그 조회 (필요시)
     */
    List<LogsDto> findAll();
}
