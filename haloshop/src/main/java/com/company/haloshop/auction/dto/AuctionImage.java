package com.company.haloshop.auction.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuctionImage {
    private Long id;
    private Long auctionId;
    private String url;
}
