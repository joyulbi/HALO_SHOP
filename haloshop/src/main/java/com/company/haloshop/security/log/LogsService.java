// src/main/java/com/company/haloshop/security/log/LogsService.java
package com.company.haloshop.security.log;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.member.LogsDto;
import com.company.haloshop.member.mapper.LogsMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogsService {

    private final LogsMapper logsMapper;

    public LogsDto getById(Long id) {
        return logsMapper.selectById(id);
    }

    public List<LogsDto> getAll() {
        return logsMapper.selectAll();
    }

    @Transactional
    public LogsDto create(HttpServletRequest req, LogsDto dto) {
        dto.setIp(req.getRemoteAddr());
        logsMapper.insertLog(dto);
        return dto;
    }

    @Transactional
    public void update(LogsDto dto) {
        logsMapper.updateLog(dto);
    }

    @Transactional
    public void delete(Long id) {
        logsMapper.deleteById(id);
    }
}
