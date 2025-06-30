package com.company.haloshop.donationhistory;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.donationcampaign.DonationCampaign;
import com.company.haloshop.donationcampaign.DonationCampaignMapper;
import com.company.haloshop.pointlog.PointLog;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationHistoryService {

    private final DonationHistoryMapper donationHistoryMapper;
    private final DonationCampaignMapper donationCampaignMapper;
    
    @Transactional
    public void createDonationHistory(DonationHistory donationHistory) {
        // 캠페인은 엔티티로 조회 후 세팅
        DonationCampaign campaign = donationCampaignMapper.findById(donationHistory.getCampaign().getId());

        // 포인트로그는 엔티티 대신 ID만 세팅
        PointLog pointLog = new PointLog();
        pointLog.setId(donationHistory.getPointLog().getId());

        donationHistory.setCampaign(campaign);
        donationHistory.setPointLog(pointLog);

        donationHistoryMapper.insertDonationHistory(donationHistory);
    }

    @Transactional(readOnly = true)
    public DonationHistory getDonationHistoryById(Long id) {
        return donationHistoryMapper.selectDonationHistoryById(id);
    }

    @Transactional(readOnly = true)
    public List<DonationHistory> getAllDonationHistories() {
        return donationHistoryMapper.selectAllDonationHistories();
    }

    @Transactional
    public void updateDonationHistory(DonationHistory donationHistory) {
        DonationCampaign campaign = donationCampaignMapper.findById(donationHistory.getCampaign().getId());

        PointLog pointLog = new PointLog();
        pointLog.setId(donationHistory.getPointLog().getId());

        donationHistory.setCampaign(campaign);
        donationHistory.setPointLog(pointLog);

        donationHistoryMapper.updateDonationHistory(donationHistory);
    }

    @Transactional
    public void deleteDonationHistoryById(Long id) {
        donationHistoryMapper.deleteDonationHistoryById(id);
    }
}
