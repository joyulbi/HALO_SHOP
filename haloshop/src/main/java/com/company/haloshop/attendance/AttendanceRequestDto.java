package com.company.haloshop.attendance;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AttendanceRequestDto {

    private Long accountId; // 요청자는 보통 본인 계정, 관리자용이면 외부 입력

    private LocalDate attendanceDate;

    public AttendanceRequestDto(Long accountId, LocalDate attendanceDate) {
        this.accountId = accountId;
        this.attendanceDate = attendanceDate;
    }
}
