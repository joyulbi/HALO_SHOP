package com.company.haloshop.notificationEvent;

import org.springframework.context.ApplicationEvent;

public class AuctionCanceledEvent extends ApplicationEvent {
    private final Long auctionId;

    public AuctionCanceledEvent(Object source, Long auctionId) {
        super(source);
        this.auctionId = auctionId;
    }

    public Long getAuctionId() {
        return auctionId;
    }
}