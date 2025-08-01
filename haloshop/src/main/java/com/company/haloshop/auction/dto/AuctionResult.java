package com.company.haloshop.auction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
public class AuctionResult {
    private Long auctionId;
    private Long accountId;
    private String accountNickname;
    private Integer finalPrice;
    private LocalDateTime createdAt;
    private Boolean confirmed;
    private LocalDateTime confirmedAt;
    private String canceledReason;
    private String adminMemo;
    private Boolean reRegistered;
}
