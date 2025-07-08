package com.company.haloshop.donationhistory;

import lombok.Data;

@Data
public class DonationHistoryRequestDto {

    private Long campaignId;
    private int amount;

}
