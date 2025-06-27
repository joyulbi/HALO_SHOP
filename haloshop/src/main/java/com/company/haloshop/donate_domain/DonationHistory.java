package com.company.haloshop.donate_domain;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class DonationHistory {
	
	private Long id;
	private Long campaignId;
	private Long PointLogId;
	private Long amount;
	private LocalDateTime createdAt = LocalDateTime.now();
	
}
