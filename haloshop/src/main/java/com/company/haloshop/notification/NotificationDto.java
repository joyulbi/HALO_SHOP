package com.company.haloshop.notification;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationDto {
    private Long id;
    private Long receiverId;
    private Long entityId;
    private Long referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}