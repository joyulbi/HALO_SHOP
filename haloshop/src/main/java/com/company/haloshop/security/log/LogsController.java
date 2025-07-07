// src/main/java/com/company/haloshop/security/log/LogsController.java
package com.company.haloshop.security.log;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.member.LogsDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/security/logs")
@RequiredArgsConstructor
public class LogsController {

    private final LogsService logsService;

    /** 1) 전체 로그 조회 */
    @GetMapping
    public ResponseEntity<List<LogsDto>> list() {
        return ResponseEntity.ok(logsService.getAll());
    }

    /** 2) 단일 로그 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<LogsDto> detail(@PathVariable Long id) {
        return ResponseEntity.ok(logsService.getById(id));
    }

    /** 3) 로그 생성 */
    @PostMapping
    public ResponseEntity<LogsDto> create(HttpServletRequest req,
                                          @RequestBody LogsDto dto) {
        LogsDto saved = logsService.create(req, dto);
        return ResponseEntity.ok(saved);
    }

    /** 4) 로그 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @RequestBody LogsDto dto) {
        dto.setId(id);
        logsService.update(dto);
        return ResponseEntity.ok().build();
    }

    /** 5) 로그 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logsService.delete(id);
        return ResponseEntity.ok().build();
    }
}
