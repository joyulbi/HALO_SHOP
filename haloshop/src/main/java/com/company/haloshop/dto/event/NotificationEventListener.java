package com.company.haloshop.dto.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.company.haloshop.event.Notification;

@Component
public class NotificationEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        Notification notification = event.getNotification();
        // WebSocket 구독 클라이언트에게 메시지 전송
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}
