package com.company.haloshop.userpoint;

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

    private Long totalPayment;   // 총 포인트

    private java.sql.Timestamp updatedAt; // 등급 변경 날짜
}