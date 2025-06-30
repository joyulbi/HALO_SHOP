package com.company.haloshop.attendance;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.company.haloshop.entity.member.Account;

@Service
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    public AttendanceService(AttendanceMapper attendanceMapper) {
        this.attendanceMapper = attendanceMapper;
    }

    public boolean isAlreadyAttended(Long accountId, LocalDate attendanceDate) {
        return attendanceMapper.countByAccountIdAndDate(accountId, attendanceDate) > 0;
    }

    public void checkAndSaveAttendance(Long accountId, LocalDate attendanceDate) {
        if (isAlreadyAttended(accountId, attendanceDate)) {
            throw new IllegalStateException("이미 출석했습니다.");
        }

        Attendance attendance = new Attendance();
        attendance.setAccount(new Account(accountId)); // Account(Long id) 생성자가 있어야 함
        attendance.setAttendanceDate(attendanceDate);

        attendanceMapper.insertAttendance(attendance);
    }

    public List<Attendance> findByAccountId(Long accountId) {
        return attendanceMapper.findAttendancesByAccountId(accountId);
    }
}