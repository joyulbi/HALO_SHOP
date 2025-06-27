package com.company.haloshop.event;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.event_domain.Notification;


@Mapper
public interface NotificationMapper {

    // 알림 등록
    void insert(Notification notification);

    // 특정 수신자 알림 목록 조회 (최근 순 정렬)
    List<Notification> findByReceiverId(@Param("receiverId") Long receiverId);

    // 알림 읽음 처리 업데이트
    void updateReadStatus(@Param("id") Long id, @Param("read") Boolean read);

}
