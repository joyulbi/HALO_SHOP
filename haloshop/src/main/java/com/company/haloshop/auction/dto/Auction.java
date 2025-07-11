package com.company.haloshop.auction.dto;

import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class Auction {
    private Long id;
    private String title;
    private String description;
    private Integer startPrice;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;
    private String status;
    private LocalDateTime createdAt;
}
