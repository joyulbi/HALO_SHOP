package com.company.haloshop.auction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuctionResult {
    private Long auctionId;
    private Long accountId;
    private Integer finalPrice;
    private LocalDateTime createdAt;
    private Boolean confirmed;
    private LocalDateTime confirmedAt;
    private String canceledReason;
    private String adminMemo;
    private Boolean reRegistered;
}
