package com.company.haloshop.notification;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.company.haloshop.notificationEvent.AuctionCanceledEvent;
import com.company.haloshop.notificationEvent.AuctionResultCreatedEvent;
import com.company.haloshop.notificationEvent.InquiryAnsweredEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final AuctionLogMapper auctionLogMapper;

    // 옥션 결과 이벤트
    @EventListener
    public void handleAuctionResultCreated(AuctionResultCreatedEvent event) {
        NotificationRequestDto dto = new NotificationRequestDto();
        dto.setReceiverId(event.getReceiverId());
        dto.setEntityId(201L); // 경매 낙찰 알림 엔티티 ID
        dto.setReferenceId(event.getAuctionId());

        notificationService.createNotification(dto); // DB 저장 + NotificationEvent 발행
    }
    
    // 옥션 취소 이벤트
//    @EventListener
//    public void handleAuctionCanceled(AuctionCanceledEvent event) {
//        Long auctionId = event.getAuctionId();
//
//        // 1. 낙찰자 조회
//        Long highestPriceAccountId = auctionLogMapper.selectHighestPriceAccountId(auctionId);
//
//        // 2. 참여자 전체 조회
//        List<Long> participantAccountIds = auctionLogMapper.selectAccountIdsByAuctionId(auctionId);
//
//        // 3. 낙찰자 제외
//        participantAccountIds.remove(highestPriceAccountId);
//
//        // 4. 알림 생성 및 발행
//        for (Long accountId : participantAccountIds) {
//            NotificationRequestDto dto = new NotificationRequestDto();
//            dto.setReceiverId(accountId);
//            dto.setEntityId(202L); // 예: 경매 취소 알림 엔티티 ID (별도 정의)
//            dto.setReferenceId(auctionId);
//
//            notificationService.createNotification(dto);
//        }
//    }
    
    
    // 문의 답변 이벤트
    @EventListener
    public void handleInquiryAnswered(InquiryAnsweredEvent event) {
        NotificationRequestDto dto = new NotificationRequestDto();
        dto.setReceiverId(event.getReceiverId());
        dto.setEntityId(event.getEventEntityId());
        dto.setReferenceId(event.getInquiryId());

        notificationService.createNotification(dto);
    }
    
    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        Notification notification = event.getNotification();
        if (notification == null || notification.getReceiver() == null) return;

        String destination = "/topic/notifications/" + notification.getReceiver().getId();

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setReceiverId(notification.getReceiver().getId());
        dto.setEntityId(notification.getEntity().getId());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        messagingTemplate.convertAndSend(destination, dto); // 실시간 푸시
    }
}
