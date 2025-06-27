package com.company.haloshop.event_domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Data;

@Data
public class Inquiry {

	private Long id;
	private Long accountId; // account FK
	private Long entityId; // entity FK}
	private String title;
	@Column(columnDefinition = "TEXT")
	private String content;
	private String file;
	private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('SUBMITTED', 'REVIEWING', 'ANSWERED') DEFAULT 'SUBMITTED'")
    private InquiryStatus status = InquiryStatus.SUBMITTED;
}
