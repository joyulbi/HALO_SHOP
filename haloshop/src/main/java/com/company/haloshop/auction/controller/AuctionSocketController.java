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
        auctionLogService.create(auctionLog);
        messagingTemplate.convertAndSend("/topic/auction/" + auctionId, auctionLog);
    }
}
