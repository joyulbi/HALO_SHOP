package com.company.haloshop.pointlog;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.CreationTimestamp;

import com.company.haloshop.entity.member.Account;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PointLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;              // 로그 ID (PK)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false) // FK 컬럼 이름 명시
    private Account account;

    private String type;          // 유형 (리뷰적립, 이벤트적립, 구매, 구매시 사용, 포인트 충전, 기부 등)

    private Integer amount;       // 포인트 양 (+적립 / -사용)

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt; // 사용 날짜
}
