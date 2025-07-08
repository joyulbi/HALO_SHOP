package com.company.haloshop.notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.haloshop.entity.member.Account;
import com.company.haloshop.event.EventEntity;
import com.company.haloshop.event.EventEntityMapper;
import com.company.haloshop.member.mapper.AccountMapper;

@Service
public class NotificationService {

    @Autowired
    private NotificationMapper notificationMapper;

    @Autowired
    private EventEntityMapper eventEntityMapper;

    // 알림 생성
    public Long createNotification(NotificationRequestDto dto) {
    	 Account receiver = new Account();
    	    receiver.setId(dto.getReceiverId());
        EventEntity entity = eventEntityMapper.findById(dto.getEntityId());

        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setEntity(entity);
        notification.setReferenceId(dto.getReferenceId());
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationMapper.insert(notification);
        return notification.getId();
    }

    // 수신자 기준 알림 조회
    public List<NotificationDto> getNotificationsForUser(Long receiverId) {
        List<Notification> notifications = notificationMapper.findByReceiverId(receiverId);
        return notifications.stream().map(n -> {
            NotificationDto dto = new NotificationDto();
            dto.setId(n.getId());
            dto.setReceiverId(n.getReceiver().getId());
            dto.setEntityId(n.getEntity().getId());
            dto.setReferenceId(n.getReferenceId());
            dto.setIsRead(n.getIsRead());
            dto.setCreatedAt(n.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    // 알림 읽음 상태 변경
    public void markAsRead(Long notificationId, Boolean isRead) {
        notificationMapper.updateById(Map.of(
            "id", notificationId,
            "isRead", isRead
        ));
    }

    // 알림 삭제
    public void deleteNotification(Long id) {
        notificationMapper.deleteById(id);
    }
}
