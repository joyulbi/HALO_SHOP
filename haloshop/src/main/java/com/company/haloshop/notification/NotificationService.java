package com.company.haloshop.notification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.entity.member.Account;
import com.company.haloshop.event.EventEntity;
import com.company.haloshop.event.EventEntityMapper;
import com.company.haloshop.member.mapper.AccountMapper;

@Service
public class NotificationService {

    @Autowired private NotificationMapper notificationMapper;
    @Autowired private EventEntityMapper eventEntityMapper;
    @Autowired private AccountMapper accountMapper;
    @Autowired private ApplicationEventPublisher applicationEventPublisher;
    @Autowired private SimpMessagingTemplate messagingTemplate;
    
    // 알림 생성
    public Long createNotification(NotificationRequestDto dto) {
    	
    	// 알림 생성 기본값
        Notification notification = new Notification();
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        // 수신자 accountDto에서 추출
        AccountDto accountDto = accountMapper.selectById(dto.getReceiverId());
        Account receiver = new Account();
        receiver.setId(accountDto.getId());
        notification.setReceiver(receiver);
        
        // 이벤트 엔티티 설정
        EventEntity eventEntity = eventEntityMapper.findById(dto.getEntityId());
        notification.setEntity(eventEntity);
        
        // 참조 테이블 Id 설정
        notification.setReferenceId(dto.getReferenceId());
        
        // 알림 생성 후 이벤트 푸쉬
        notificationMapper.insert(notification);
        Notification saved = notificationMapper.findById(notification.getId());
        applicationEventPublisher.publishEvent(new NotificationEvent(this, saved));
        sendNotificationToUser(saved);
        
        return saved.getId();
    }
    
    // 문의 답변용 (구) 알림 로직
    /*
        	
    	AccountDto accountDto = accountMapper.selectById(dto.getReceiverId());
    	Account receiver = new Account();
    	receiver.setId(accountDto.getId());
        EventEntity entity = eventEntityMapper.findById(dto.getEntityId());

        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setEntity(entity);
        notification.setReferenceId(dto.getReferenceId());
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationMapper.insert(notification);
        Notification saved = notificationMapper.findById(notification.getId());

        applicationEventPublisher.publishEvent(new NotificationEvent(this, saved)); // 여기서 발행
        sendNotificationToUser(saved);
        return saved.getId(); 
     
     */

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
    
    // id로 알림 조회
    public Notification findById(Long id) {
        return notificationMapper.findById(id);
    }

    // 알림 읽음 상태 변경
    public void markAsRead(Long notificationId, Boolean isRead) {
        notificationMapper.updateById(Map.of(
            "id", notificationId,
            "isRead", isRead
        ));
    }
    
    // 특정 유저 알림 모두 읽음 처리
    public int markAllAsRead(Long receiverId, Boolean isRead) {
        return notificationMapper.updateAllByAccountId(receiverId, isRead);
    }

    // 알림 삭제
    public void deleteNotification(Long id) {
        notificationMapper.deleteById(id);
    }
    
    // 알림 푸시
    public void sendNotificationToUser(Notification notification) {
        // destination 예: /user/{username}/queue/notifications
        String destination = "/user/" + notification.getReceiver().getId() + "/queue/notifications";
        messagingTemplate.convertAndSend(destination, notification);
    }
}
