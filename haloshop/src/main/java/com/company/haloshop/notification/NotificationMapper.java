package com.company.haloshop.notification;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface NotificationMapper {

    // 1. 알림 생성
    int insert(Notification notification);
    
    // id로 알림 조회
    Notification findById(@Param("id") Long id);

    // 2. 본인 알림 조회
    List<Notification> findByReceiverId(@Param("receiverId") Long receiverId);

    // 3. 알림 읽음 상태 업데이트
    int updateById(Map<String, Object> params);
    
    // 3-2. 특정 유저의 알림 모두 읽음 처리
    int updateAllByAccountId(@Param("receiverId") Long receiverId, @Param("isRead") Boolean isRead);

    // 4. 알림 삭제
    int deleteById(@Param("id") Long id);
}
