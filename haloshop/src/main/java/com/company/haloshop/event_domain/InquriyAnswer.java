package com.company.haloshop.event_domain;

import java.time.LocalDateTime;

import javax.persistence.Column;

import lombok.Data;

@Data
public class InquriyAnswer {
	
	private Long inquiryId;	// Inquiry FK, PK
	
	@Column(columnDefinition = "TEXT")
	private String answer;
	
	private Long accountId; // account FK
	
	private LocalDateTime createdAt = LocalDateTime.now();
	
}
