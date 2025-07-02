package com.company.haloshop.userpoint;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;      // FK: account.id
    
    private Long totalPayment;

    private Long totalPoint;   // 총 포인트
    
    private String grade; // 멤버십 등급 (BRONZE, SILVER, GOLD, VIP)

    private LocalDateTime updatedAt;
}