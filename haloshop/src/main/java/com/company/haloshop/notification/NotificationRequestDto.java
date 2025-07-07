package com.company.haloshop.notification;

import lombok.Data;

@Data
public class NotificationRequestDto {

    private Long receiverId;
    private Long entityId;
    private Long referenceId;
}
