package com.company.haloshop.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // 출석 체크 요청
    @PostMapping
    public ResponseEntity<String> checkAttendance(@RequestBody AttendanceRequestDto requestDto) {
        try {
            LocalDate attendanceDate = requestDto.getAttendanceDate() != null
                    ? requestDto.getAttendanceDate()
                    : LocalDate.now();

            attendanceService.checkAndSaveAttendance(requestDto.getAccountId(), attendanceDate);

            return ResponseEntity.ok("출석 완료");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 특정 계정 출석 기록 조회
    @GetMapping("/{accountId}")
    public ResponseEntity<List<AttendanceDto>> getAttendances(@PathVariable Long accountId) {
        List<Attendance> attendances = attendanceService.findByAccountId(accountId);

        List<AttendanceDto> dtos = attendances.stream()
            .map(att -> AttendanceDto.builder()
                .id(att.getId())
                .accountId(att.getAccount().getId())
                .accountName(att.getAccount().getNickname()) // Account에 nickname 필드 기준
                .attendanceDate(att.getAttendanceDate())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}