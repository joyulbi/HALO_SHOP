package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.service.AuctionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class AuctionSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionLogService auctionLogService;

    @MessageMapping("/auction/{auctionId}")
    public void bid(@DestinationVariable Long auctionId, AuctionLog auctionLog) {
        auctionLog.setAuctionId(auctionId);

        try {
            // 정책/유효성 체크 bid()만 사용!
            auctionLogService.bid(
                auctionLog.getAuctionId(),
                auctionLog.getAccountId(),
                auctionLog.getPrice()
            );
            // 성공시 브로드캐스트
            messagingTemplate.convertAndSend("/topic/auction/" + auctionId, auctionLog);
        } catch (RuntimeException e) {
            // 실패시 에러도 실시간 전송(프론트에서 따로 구독해서 안내 가능)
            messagingTemplate.convertAndSend("/topic/auction/" + auctionId + "/error", e.getMessage());
        }
    }
}
