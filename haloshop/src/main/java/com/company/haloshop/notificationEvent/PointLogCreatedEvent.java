package com.company.haloshop.notificationEvent;

import org.springframework.context.ApplicationEvent;

import com.company.haloshop.dto.shop.PointLogDto;

public class PointLogCreatedEvent extends ApplicationEvent {
	
	private final PointLogDto pointLogDto;
	
	public PointLogCreatedEvent(Object source, PointLogDto pointLogDto) {
		super(source);
		this.pointLogDto = pointLogDto;
	}
	
	public PointLogDto getPointLogDto() {
		return pointLogDto;
	}
}
