package com.company.haloshop.auction.logic;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.mapper.AuctionLogMapper;
import com.company.haloshop.auction.mapper.AuctionResultMapper;
import com.company.haloshop.auction.dto.AuctionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 최고 입찰자를 계산해 낙찰 정보 저장하는 유틸
 */
@Component
@RequiredArgsConstructor
public class AuctionResultCalculator {

    private final AuctionLogMapper auctionLogMapper;
    private final AuctionResultMapper auctionResultMapper;

    public void calculateAndSave(Long auctionId) {
        AuctionLog topLog = auctionLogMapper.findTopByAuctionId(auctionId);
        if (topLog == null) return;

        AuctionResult result = new AuctionResult();
        result.setAuctionId(auctionId);
        result.setAccountId(topLog.getAccountId());
        result.setFinalPrice(topLog.getPrice());
        result.setCreatedAt(LocalDateTime.now());

        auctionResultMapper.insert(result);
    }
    
    public AuctionResult getAuctionWinner(Long auctionId) {
        System.out.println("[낙찰자 계산 시작] auctionId=" + auctionId);
        AuctionLog topLog = auctionLogMapper.findTopByAuctionId(auctionId);
        if (topLog == null) {
            System.out.println("[낙찰자 없음] auctionId=" + auctionId + " → 입찰 기록 없음");
            return null;
        }

        AuctionResult result = new AuctionResult();
        result.setAuctionId(auctionId);
        result.setAccountId(topLog.getAccountId());
        result.setFinalPrice(topLog.getPrice());
        result.setCreatedAt(LocalDateTime.now());
        result.setConfirmed(null);
        result.setConfirmedAt(null);
        result.setCanceledReason(null);
        result.setAdminMemo(null);
        result.setReRegistered(false);

        System.out.println("[낙찰자 계산 완료] auctionId=" + auctionId + " → accountId=" + topLog.getAccountId() + ", price=" + topLog.getPrice());
        return result;
    }    
}
