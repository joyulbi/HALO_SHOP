package com.company.haloshop.auction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuctionLog {
    private Long id;
    private Long auctionId;
    private Long accountId;
    private Integer price;
    private LocalDateTime createdAt;
}
