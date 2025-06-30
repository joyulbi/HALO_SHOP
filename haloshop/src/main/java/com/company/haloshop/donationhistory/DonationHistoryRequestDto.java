package com.company.haloshop.donationhistory;

import lombok.Data;

@Data
public class DonationHistoryRequestDto {

    private Long campaignId;    // 어떤 캠페인에 대한 기부인지
    private Long pointLogId;    // 연결된 포인트 로그 ID
    private Long amount;        // 기부 금액

}
