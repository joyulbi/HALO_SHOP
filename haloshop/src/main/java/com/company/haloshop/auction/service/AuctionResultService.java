package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionResult;
import com.company.haloshop.auction.mapper.AuctionMapper;
import com.company.haloshop.auction.mapper.AuctionResultMapper;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import com.company.haloshop.auction.logic.AuctionResultCalculator;

@Service
@RequiredArgsConstructor
public class AuctionResultService {

    private final AuctionResultMapper auctionResultMapper;
    private final AuctionResultCalculator calculator;
    private final AuctionMapper auctionMapper;

    // 낙찰 결과 단건 조회
    public AuctionResult getByAuctionId(Long auctionId) {
        return auctionResultMapper.selectByAuctionId(auctionId);
    }

    // 낙찰 결과 등록
    public void create(AuctionResult auctionResult) {
        auctionResultMapper.insert(auctionResult);
    }

    // 낙찰 결과 수정
    public void update(AuctionResult auctionResult) {
        auctionResultMapper.update(auctionResult);
    }

    // 낙찰 결과 삭제
    public void delete(Long auctionId) {
        auctionResultMapper.delete(auctionId);
    }
    
    // 타이머 경매 종료 시 낙찰 자동 저장
//    public void saveAuctionResult(Long auctionId) {
//        if (auctionResultMapper.selectByAuctionId(auctionId) != null) return;
//        calculator.calculateAndSave(auctionId);
//    }
    public void saveAuctionResult(Long auctionId) {
        System.out.println("[결과 저장 시도] auctionId=" + auctionId);

        AuctionResult result = calculator.getAuctionWinner(auctionId);
        if (result == null) {
            System.out.println("[결과 없음] auctionId=" + auctionId + " → 낙찰자 없음");
            return;
    }

        auctionResultMapper.insert(result);
        System.out.println("[결과 저장 완료] auctionId=" + auctionId + " → 낙찰자 ID=" + result.getAccountId() + ", 금액=" + result.getFinalPrice());
    }
    
    
    // 스케쥴러 경매 종료 시 낙찰 자동 저장 
    public void saveResultsForEndedAuctions() {
        List<Long> finishedAuctionIds = auctionMapper.selectFinishedAuctionsWithoutResult(); 
        for (Long auctionId : finishedAuctionIds) {
            saveAuctionResult(auctionId);
        }
    }
}
