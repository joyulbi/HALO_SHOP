package com.company.haloshop.attendance;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AttendanceMapper {

    // 출석 등록
    void insertAttendance(Attendance attendance);

    // 출석 단건 조회
    Attendance findAttendanceById(Long id);

    // 계정의 출석 기록 전체 조회
    List<Attendance> findAttendancesByAccountId(Long accountId);

    // 출석 기록 삭제
    void deleteAttendance(Long id);

    // 출석 존재 여부 확인 (COUNT 방식)
    int countByAccountIdAndDate(@Param("accountId") Long accountId,
                                 @Param("attendanceDate") LocalDate attendanceDate);

}