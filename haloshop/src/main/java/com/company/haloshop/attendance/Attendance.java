package com.company.haloshop.attendance;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.company.haloshop.entity.member.Account;

import lombok.Data;

@Entity
@EntityListeners(AttendanceListener.class)
@Data
@Table(name = "attendance",
       uniqueConstraints = @UniqueConstraint(columnNames = {"account_id", "attendance_date"}))
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Account 엔티티 타입으로 연관관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;
}
