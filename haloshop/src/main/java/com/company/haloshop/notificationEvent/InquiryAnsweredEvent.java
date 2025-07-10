package com.company.haloshop.notificationEvent;

import org.springframework.context.ApplicationEvent;

public class InquiryAnsweredEvent extends ApplicationEvent {
    private final Long inquiryId;
    private final Long receiverId;
    private final Long eventEntityId;

    public InquiryAnsweredEvent(Object source, Long inquiryId, Long receiverId, Long eventEntityId) {
        super(source);
        this.inquiryId = inquiryId;
        this.receiverId = receiverId;
        this.eventEntityId = eventEntityId;
    }

    public Long getInquiryId() {
        return inquiryId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public Long getEventEntityId() {
        return eventEntityId;
    }
}
