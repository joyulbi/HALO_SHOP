package com.company.haloshop.attendance;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AttendanceDto {

    private Long id;
    private Long accountId;
    private String accountName; // Account 객체에서 이름을 꺼내서 채워 넣음
    private LocalDate attendanceDate;
}
