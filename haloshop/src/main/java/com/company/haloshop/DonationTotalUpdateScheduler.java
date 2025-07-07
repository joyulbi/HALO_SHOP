package com.company.haloshop;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.donationcampaign.DonationCampaignMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DonationTotalUpdateScheduler {

    private final DonationCampaignMapper donationCampaignMapper;

    //@Scheduled(fixedRate = 60000) 테스트용 1분 주기 실행
    @Scheduled(cron = "0 0 * * * ?") // 매 정각마다 실행
    @Transactional
    public void updateDonationTotals() {
        List<Map<String, Object>> sums = donationCampaignMapper.sumDonationAmountLastHour();

        for (Map<String, Object> row : sums) {
            Long campaignId = ((Number) row.get("campaign_id")).longValue();
            Integer totalAmount = ((Number) row.get("total_amount")).intValue();

            donationCampaignMapper.updateDonationCampaignTotal(campaignId, totalAmount);
        }

        System.out.println("Donation totals updated at " + LocalDateTime.now());
    }
}
