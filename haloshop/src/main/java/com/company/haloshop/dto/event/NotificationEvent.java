package com.company.haloshop.dto.event;

import org.springframework.context.ApplicationEvent;

import com.company.haloshop.event.Notification;

public class NotificationEvent extends ApplicationEvent {
	private static final long serialVersionUID = 1L;
	
    private final Notification notification;

    public NotificationEvent(Object source, Notification notification) {
        super(source);
        this.notification = notification;
    }

    public Notification getNotification() {
        return notification;
    }
}

