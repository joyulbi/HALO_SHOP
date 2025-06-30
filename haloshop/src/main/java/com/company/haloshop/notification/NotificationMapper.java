package com.company.haloshop.notification;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface NotificationMapper {

    int createNotification(NotificationDto notificationDto);

    List<NotificationDto> findByReceiverId(@Param("receiverId") Long receiverId);

    void updateReadStatus(@Param("id") Long id, @Param("isRead") Boolean read);
}
