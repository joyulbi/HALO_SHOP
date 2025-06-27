package com.company.haloshop.event;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.company.haloshop.event_domain.Notification;

@Service
public class NotificationService {

    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationMapper notificationMapper) {
        this.notificationMapper = notificationMapper;
    }

    // 알림 생성
    public void createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationMapper.insert(notification);
    }

    // 특정 수신자 알림 조회
    public List<Notification> getNotificationsForUser(Long receiverId) {
        return notificationMapper.findByReceiverId(receiverId);
    }

    // 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        notificationMapper.updateReadStatus(notificationId, true);
    }
}
