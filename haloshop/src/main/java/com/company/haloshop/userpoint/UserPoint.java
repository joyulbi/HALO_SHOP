package com.company.haloshop.userpoint;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.company.haloshop.entity.member.Account;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false) // FK 컬럼 이름 명시
    private Account account;
    
    private Long totalPayment;

    private Long totalPoint;   // 총 포인트
    
    private String grade; // 멤버십 등급 (BRONZE, SILVER, GOLD, VIP)

    private LocalDateTime updatedAt;
}