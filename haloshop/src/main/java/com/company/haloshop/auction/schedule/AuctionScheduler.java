package com.company.haloshop.auction.schedule;

import com.company.haloshop.auction.service.AuctionService;
import com.company.haloshop.auction.service.AuctionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 경매 상태를 주기적으로 점검하는 스케줄러
 * - READY → ONGOING
 * - ONGOING → FINISHED
 */
@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionService auctionService;
    private final AuctionResultService auctionResultService;

    @Scheduled(fixedRate = 10000)
    public void checkAuctionStatus() {
        auctionService.updateToOngoingIfNeeded();
        auctionService.updateToFinishedIfNeeded();
        auctionResultService.saveResultsForEndedAuctions();
    }
}
