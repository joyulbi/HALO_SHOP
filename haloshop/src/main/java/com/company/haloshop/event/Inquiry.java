package com.company.haloshop.event;

import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.Data;

@Data
@Entity
@Table(name = "inquiry")
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="account_id")
    private Long accountId; // FK (별도 매핑 X, 숫자 ID만 보관)

    @Column(name="entity_id")
    private Long entityId; // FK

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String file;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('SUBMITTED', 'REVIEWING', 'ANSWERED') DEFAULT 'SUBMITTED'")
    private InquiryStatus status = InquiryStatus.SUBMITTED;
}
