package com.company.haloshop.notification;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // 1. 알림 생성
    @PostMapping
    public ResponseEntity<Long> createNotification(@RequestBody NotificationRequestDto requestDto) {
        Long id = notificationService.createNotification(requestDto);
        return ResponseEntity.ok(id);
    }

    // 2. 특정 수신자의 알림 목록 조회
    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByReceiver(@PathVariable Long receiverId) {
        List<NotificationDto> notifications = notificationService.getNotificationsForUser(receiverId);
        return ResponseEntity.ok(notifications);
    }

    // 3. 알림 읽음 상태 변경
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @RequestParam Boolean isRead) {
        notificationService.markAsRead(id, isRead);
        return ResponseEntity.ok().build();
    }
    
    // 3-2. 특정 유저 알림 읽음 처리
    @PutMapping("/mark-all-as-read/{receiverId}")
    public int markAllAsRead(@PathVariable Long receiverId, @RequestParam Boolean isRead) {
        return notificationService.markAllAsRead(receiverId, isRead);
    }

    // 4. 알림 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}
