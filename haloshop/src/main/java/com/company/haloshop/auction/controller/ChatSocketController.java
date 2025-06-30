package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{auctionId}")
    public void chat(@DestinationVariable Long auctionId, ChatMessage message) {
        messagingTemplate.convertAndSend("/topic/chat/" + auctionId, message);
    }
}
