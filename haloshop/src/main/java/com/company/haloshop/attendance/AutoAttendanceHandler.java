package com.company.haloshop.attendance;

import java.time.LocalDate;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.company.haloshop.security.CustomUserDetails;

@Component
public class AutoAttendanceHandler {

    private final AttendanceService attendanceService;

    public AutoAttendanceHandler(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    public void handle(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails) {
            Long accountId = ((CustomUserDetails) principal).getId();
            LocalDate today = LocalDate.now();
            if (!attendanceService.isAlreadyAttended(accountId, today)) {
                attendanceService.checkAndSaveAttendance(accountId, today);
            }
        } else {
            throw new IllegalStateException("로그인한 사용자 정보가 CustomUserDetails 타입이 아닙니다.");
        }
    }
    
    // 로그인 성공 시 successHandler(AutoAttendanceHandler) 를 호출할 것
}