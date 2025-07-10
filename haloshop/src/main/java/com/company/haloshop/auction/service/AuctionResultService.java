package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.dto.AuctionResult;
import com.company.haloshop.auction.mapper.AuctionMapper;
import com.company.haloshop.auction.mapper.AuctionResultMapper;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.auction.logic.AuctionResultCalculator;

@Service
@RequiredArgsConstructor
public class AuctionResultService {

    private final AuctionResultMapper auctionResultMapper;
    private final AuctionResultCalculator calculator;
    private final AuctionMapper auctionMapper;
    private final AuctionService auctionService;

    // 낙찰 결과 단건 조회
    public AuctionResult getByAuctionId(Long auctionId) {
        return auctionResultMapper.selectByAuctionId(auctionId);
    }
    
    // 계정별 낙찰 결과 리스트 조회
    public List<AuctionResult> getByAccountId(Long accountId) {
        return auctionResultMapper.selectByAccountId(accountId);
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
    
    // --- 구매확정/취소/관리자 메모 추가 ---

    // 구매 확정(confirmed: true, confirmedAt 세팅, adminMemo 입력)
    @Transactional
    public void confirmAuctionResult(Long auctionId) {
        AuctionResult result = auctionResultMapper.selectByAuctionId(auctionId);
        if (result == null) throw new IllegalArgumentException("해당 경매의 낙찰 결과가 없습니다.");
        result.setConfirmed(true);
        result.setConfirmedAt(LocalDateTime.now());
        result.setCanceledReason(null);      
        auctionResultMapper.update(result);
    }

    // 구매 취소(confirmed: false, confirmedAt 세팅, canceledReason, adminMemo 입력)
    @Transactional
    public void cancelAuctionResult(Long auctionId, String canceledReason) {
        AuctionResult result = auctionResultMapper.selectByAuctionId(auctionId);
        if (result == null) throw new IllegalArgumentException("해당 경매의 낙찰 결과가 없습니다.");
        if (canceledReason == null || canceledReason.isBlank()) {
            throw new IllegalArgumentException("취소 사유는 필수입니다.");
        }
        result.setConfirmed(false);
        result.setConfirmedAt(LocalDateTime.now());
        result.setCanceledReason(canceledReason);
        auctionResultMapper.update(result);
        
        Auction auction = auctionService.getById(auctionId);
        auction.setStatus("CANCELED");
        auctionService.update(auction);
    }
    
    // 관리자 메모
    @Transactional
    public void updateAdminMemo(Long auctionId, String adminMemo) {
        AuctionResult result = auctionResultMapper.selectByAuctionId(auctionId);
        if (result == null) throw new IllegalArgumentException("해당 경매의 낙찰 결과가 없습니다.");
        result.setAdminMemo(adminMemo);
        auctionResultMapper.update(result);
    }
}
