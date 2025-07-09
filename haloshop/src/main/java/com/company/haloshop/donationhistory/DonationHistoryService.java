package com.company.haloshop.donationhistory;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.donationcampaign.DonationCampaign;
import com.company.haloshop.donationcampaign.DonationCampaignMapper;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.shop.PointLogDto;
import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.pointlog.PointLog;
import com.company.haloshop.pointlog.PointLogService;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationHistoryService {

    private final DonationHistoryMapper donationHistoryMapper;
    private final DonationCampaignMapper donationCampaignMapper;
    private final AccountMapper accountMapper;
    private final UserPointService userPointService;
    private final PointLogService pointLogService;
    
    @Transactional
    public void donate(Long accountId, Long campaignId, int amount) {
        // 1. 예외 확인
        AccountDto account = accountMapper.selectById(accountId);
        if (account == null) {
            throw new IllegalArgumentException("유저를 찾을 수 없습니다.");
        }

        DonationCampaign campaign = donationCampaignMapper.findById(campaignId);
        if (campaign == null) {
            throw new IllegalArgumentException("존재하지 않는 캠페인입니다. campaignId: " + campaignId);
        }

        UserPointDto userPoint = userPointService.findByAccountId(accountId);
        if (userPoint == null || userPoint.getTotalPoint() < amount) {
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }

        // 2. 포인트 로그 생성 및 저장
        PointLogDto pointLog = new PointLogDto();
        pointLog.setAccountId(accountId);
        pointLog.setType("DONATE");
        pointLog.setAmount(amount);
        pointLog.setCreatedAt(LocalDateTime.now());
        pointLogService.insert(pointLog);  // insert 후 pointLog.id가 세팅되어야 함

        if (pointLog.getId() == null) {
            throw new IllegalStateException("포인트 로그 저장 실패: ID가 생성되지 않음");
        }

        // 3. 유저 포인트 차감
        userPoint.setTotalPoint(userPoint.getTotalPoint() - amount);
        userPoint.setUpdatedAt(LocalDateTime.now());
        userPointService.update(userPoint);

        // 4. 기부 내역 생성 및 저장
        DonationHistory donationHistory = new DonationHistory();
        donationHistory.setCampaign(campaign);
        PointLog pl = new PointLog();
        pl.setId(pointLog.getId()); // 반드시 DB에 저장된 pointLog ID를 세팅해야 함
        donationHistory.setPointLog(pl);
        donationHistory.setAmount((long) amount);
        donationHistory.setCreatedAt(LocalDateTime.now());
        donationHistoryMapper.insertDonationHistory(donationHistory);
        
        // total 최신화
        donationCampaignMapper.incrementDonationTotal(campaignId, amount);
        
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
