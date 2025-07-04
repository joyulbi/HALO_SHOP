package com.company.haloshop.auction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
public class Auction {
    private Long id;
    private String title;
    private String description;
    private Integer startPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private LocalDateTime createdAt;
}
