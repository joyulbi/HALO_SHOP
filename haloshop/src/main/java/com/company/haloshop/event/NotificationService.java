package com.company.haloshop.event;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.company.haloshop.event_domain.Notification;

@Service
public class NotificationService {
	
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationMapper notificationMapper) {
        this.notificationMapper = notificationMapper;
    }

    // 알림 생성
    public void createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);

        // DB에 알림 저장
        notificationMapper.insert(notification);

        // 이벤트 발행
        eventPublisher.publishEvent(new NotificationEvent(this, notification));
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
