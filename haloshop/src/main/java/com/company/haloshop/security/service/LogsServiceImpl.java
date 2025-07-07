package com.company.haloshop.security.service;

import com.company.haloshop.dto.member.LogsDto;
import com.company.haloshop.member.mapper.LogsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogsServiceImpl implements LogsService {

    private final LogsMapper logsMapper;

    @Override
    public void createLog(LogsDto log) {
        // MyBatis 매퍼 호출
        logsMapper.insertLog(log);
    }

    @Override
    public List<LogsDto> findAll() {
        return logsMapper.selectAll();
    }
}
