package com.company.haloshop.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        Notification notification = event.getNotification();

        // 수신자 ID 기준으로 WebSocket 사용자별 채널로 전송
        Long receiverId = notification.getReceiver().getId();
        String destination = "/topic/notifications/" + receiverId;

        // 클라이언트에 보낼 DTO 구성
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setReceiverId(receiverId);
        dto.setEntityId(notification.getEntity().getId());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        // WebSocket 전송
        messagingTemplate.convertAndSend(destination, dto);
    }
}
