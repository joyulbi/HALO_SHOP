package com.company.haloshop.donationhistory;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DonationHistoryDto {

    private Long id;
    private Long campaignId;
    private String campaignName; 
    private Long pointLogId;
    private Long amount;
    private LocalDateTime createdAt;
}
