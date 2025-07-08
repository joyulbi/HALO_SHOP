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

        if (notification == null) {
            // 이벤트에 notification 자체가 없으면 로그 후 종료
            System.err.println("NotificationEvent received with null notification");
            return;
        }

        if (notification.getReceiver() == null) {
            System.err.println("Notification receiver is null");
            return;
        }

        if (notification.getEntity() == null) {
            System.err.println("Notification entity is null");
            return;
        }

        Long receiverId = notification.getReceiver().getId();
        String destination = "/topic/notifications/" + receiverId;

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setReceiverId(receiverId);
        dto.setEntityId(notification.getEntity().getId());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        messagingTemplate.convertAndSend(destination, dto);
    }
}
