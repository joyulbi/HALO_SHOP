package com.company.haloshop.attendance;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.entity.member.Account;
import com.company.haloshop.pointlog.PointLogService;
import com.company.haloshop.userpoint.UserPointMapper;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;
    private final PointLogService pointLogService;
    private final UserPointService userPointService;
    private final UserPointMapper userPointMapper;

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
        
        // 로그 저장
        pointLogService.saveLog(accountId, "ATTENDANCE", 10);
        
        // 포인트 업데이트
        UserPointDto userpointDto;
        UserPointDto existing = userPointMapper.findByAccountId(accountId);
        if (existing == null) {
            userpointDto = new UserPointDto();
            userpointDto.setAccountId(accountId);
            userpointDto.setTotalPayment(0L);
            userpointDto.setTotalPoint(10L); // 최초 등록 시 10점 바로 추가
            userpointDto.setGrade(null);
            userPointMapper.insert(userpointDto);
        } else {
            existing.setTotalPoint(existing.getTotalPoint() + 10);
            userpointDto = existing;
            userPointService.update(userpointDto);
        }
    }

    public List<Attendance> findByAccountId(Long accountId) {
        return attendanceMapper.findAttendancesByAccountId(accountId);
    }
}