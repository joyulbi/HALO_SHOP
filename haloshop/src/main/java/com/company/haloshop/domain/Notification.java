package com.company.haloshop.domain;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Notification {

	private Long id;
	private Long reciverId;
	private Long entityId;
	private Long referenceId;
	private boolean read = false;
	private LocalDateTime createdAt = LocalDateTime.now();
}
