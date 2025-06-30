package com.company.haloshop.attendance;

import javax.persistence.PostPersist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AttendanceListener {

    private static AttendanceService attendanceService;

    @Autowired
    public void setAttendanceService(AttendanceService attendanceService) {
        AttendanceListener.attendanceService = attendanceService;
    }

    @PostPersist
    public void afterAttendancePersist(Attendance attendance) {
        // 출석이 저장된 직후 호출되는 콜백

        // 예: 출석 보상 처리 호출
        // attendanceService.rewardAttendance(attendance);

        System.out.println("Attendance saved for accountId: " + attendance.getAccount().getId()
            + ", date: " + attendance.getAttendanceDate());
    }
}
