package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.service.AuctionLogService;
import com.company.haloshop.auction.service.AuctionService;
import com.company.haloshop.auction.realtime.AuctionTimerManager;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * 입찰 WebSocket 컨트롤러
 * - 입찰 메시지 수신 처리
 * - 입장 시 서버 타이머 등록
 */
@Controller
@RequiredArgsConstructor
public class AuctionSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionLogService auctionLogService;
    private final AuctionService auctionService;
    private final AuctionTimerManager timerManager;

    /**
     * WebSocket을 통한 입찰 처리
     * - 클라이언트에서 입찰 메시지 전송 시
     * - 유효성 검증 후 DB 저장 및 실시간 브로드캐스트
     */
    @MessageMapping("/auction/{auctionId}")
    public void bid(@DestinationVariable Long auctionId, AuctionLog auctionLog) {
        auctionLog.setAuctionId(auctionId);

        try {
            // 정책/유효성 체크: 반드시 Service 단 bid() 사용
            auctionLogService.bid(
                auctionLog.getAuctionId(),
                auctionLog.getAccountId(),
                auctionLog.getPrice()
            );

            // 성공 시: 실시간 브로드캐스트
            messagingTemplate.convertAndSend("/topic/auction/" + auctionId, auctionLog);

        } catch (RuntimeException e) {
            // 실패 시: 에러 메시지 실시간 전송 (프론트에서 별도 처리 가능)
            messagingTemplate.convertAndSend("/topic/auction/" + auctionId + "/error", e.getMessage());
        }
    }

    /**
     * 경매 상세 입장 시 타이머 등록
     * - 클라이언트가 페이지 입장하면 호출됨
     * - 서버에서 endTime 기준으로 타이머 예약
     */
    @GetMapping("/auction/{id}/enter")
    public void enterAuctionRoom(@PathVariable Long id) {
        Auction auction = auctionService.getById(id);
        timerManager.registerAuctionTimer(auction.getId(), auction.getEndTime());
    }
}
