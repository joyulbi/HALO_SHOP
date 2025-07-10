package com.company.haloshop.notificationEvent;

import org.springframework.context.ApplicationEvent;

public class AuctionResultCreatedEvent extends ApplicationEvent {

    private final Long auctionId;
    private final Long receiverId;

    public AuctionResultCreatedEvent(Object source, Long auctionId, Long receiverId) {
        super(source);
        this.auctionId = auctionId;
        this.receiverId = receiverId;
    }

    public Long getAuctionId() {
        return auctionId;
    }

    public Long getReceiverId() {
        return receiverId;
    }
}