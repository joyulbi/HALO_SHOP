package com.company.haloshop.security.log;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.member.LogsDto;
import com.company.haloshop.security.log.LogsService;   // 정확한 패키지로 import

@RestController
@RequestMapping("/admin/logs")
@PreAuthorize("@adminCheck.hasAuthority(authentication)")  // 관리자만 접근
public class AdminLogsController {

    private final LogsService logsService;

    public AdminLogsController(LogsService logsService) {
        this.logsService = logsService;
    }

    /**
     * 모든 보안 로그 조회
     */
    @GetMapping
    public ResponseEntity<List<LogsDto>> getAll() {
        List<LogsDto> all = logsService.getAll();
        return ResponseEntity.ok(all);
    }
}
