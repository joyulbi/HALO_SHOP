package com.company.haloshop.notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.company.haloshop.entity.member.Account;
import com.company.haloshop.event.EventEntity;

@Service
public class NotificationService {

    @Autowired
    private ApplicationEventPublisher eventPublisher;
    private SimpMessagingTemplate messagingTemplate;
    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationMapper notificationMapper) {
        this.notificationMapper = notificationMapper;
    }

    // 알림 생성

    // 알림 생성
    public void createNotification(NotificationRequestDto requestDto) {
        // DTO -> 엔티티 변환
        Notification notification = new Notification();

        Account receiver = new Account();
        receiver.setId(requestDto.getReceiverId());
        notification.setReceiver(receiver);

        EventEntity entity = new EventEntity();
        entity.setId(requestDto.getEntityId());
        notification.setEntity(entity);

        notification.setReferenceId(requestDto.getReferenceId());
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        // DB 저장용 DTO 생성
        NotificationDto dto = new NotificationDto();
        dto.setReceiverId(notification.getReceiver().getId());
        dto.setEntityId(notification.getEntity().getId());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        if (dto.getReceiverId() == null || dto.getEntityId() == null) {
            throw new IllegalArgumentException("receiverId나 entityId가 null입니다.");
        }

        notificationMapper.createNotification(dto);

        // 이벤트 발행 시 Notification 엔티티 객체 전달
        eventPublisher.publishEvent(new NotificationEvent(this, notification));
    }


    // 특정 수신자 알림 조회
    public List<Notification> getNotificationsForUser(Long receiverId) {
        List<NotificationDto> dtos = notificationMapper.findByReceiverId(receiverId);
        return dtos.stream().map(dto -> {
            Notification noti = new Notification();

            noti.setId(dto.getId());
            noti.setReferenceId(dto.getReferenceId());
            noti.setIsRead(dto.getIsRead());
            noti.setCreatedAt(dto.getCreatedAt());

            // receiver와 entity는 ID만 세팅 (DB 조회는 안 함)
            Account receiver = new Account();
            receiver.setId(dto.getReceiverId());
            noti.setReceiver(receiver);

            EventEntity entity = new EventEntity();
            entity.setId(dto.getEntityId());
            noti.setEntity(entity);

            return noti;
        }).collect(Collectors.toList());
    }

    // 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        notificationMapper.updateReadStatus(notificationId, true);
    }
}
