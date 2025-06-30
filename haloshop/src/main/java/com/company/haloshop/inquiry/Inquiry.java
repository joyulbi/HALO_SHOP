package com.company.haloshop.inquiry;

import java.time.LocalDateTime;
import javax.persistence.*;

import com.company.haloshop.entity.member.Account;
import com.company.haloshop.event.EventEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "inquiry")
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ 작성자 FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    // ✅ 관련 엔터티 FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private EventEntity entity;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String file;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('SUBMITTED', 'REVIEWING', 'ANSWERED') DEFAULT 'SUBMITTED'")
    private InquiryStatus status = InquiryStatus.SUBMITTED;
}
