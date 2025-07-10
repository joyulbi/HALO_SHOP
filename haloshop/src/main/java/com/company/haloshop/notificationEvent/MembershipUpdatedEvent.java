package com.company.haloshop.notificationEvent;

import org.springframework.context.ApplicationEvent;

import com.company.haloshop.dto.shop.UserPointDto;

public class MembershipUpdatedEvent extends ApplicationEvent {
	private final UserPointDto userPointDto;

	public MembershipUpdatedEvent(Object source, UserPointDto userPointDto) {
		super(source);
		this.userPointDto = userPointDto;
	}

	public UserPointDto getUserPointDto() {
		return userPointDto;
	}
}
