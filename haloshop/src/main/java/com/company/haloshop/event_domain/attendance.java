package com.company.haloshop.event_domain;

import java.time.LocalDate;

import lombok.Data;

@Data
public class attendance {

	private Long accountId; // account FK PK
	private LocalDate attendance_date = LocalDate.now();
}
