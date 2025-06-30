package com.company.haloshop.auction.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private Long auctionId;
    private String sender;
    private String content;
}
