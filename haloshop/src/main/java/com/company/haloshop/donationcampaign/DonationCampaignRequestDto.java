package com.company.haloshop.donationcampaign;

import lombok.Data;

@Data
public class DonationCampaignRequestDto {

    private Long id;
    private String image;
    private Long total;
    private Long seasonId;
    private Long teamId;
}