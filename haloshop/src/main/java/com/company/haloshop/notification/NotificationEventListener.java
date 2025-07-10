package com.company.haloshop.notification;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.mapper.AuctionLogMapper;
import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.shop.DeliveryTrackingDTO;
import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderItemDto;
import com.company.haloshop.dto.shop.PointLogDto;
import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.member.mapper.AccountMapper;
import com.company.haloshop.notificationEvent.AuctionCanceledEvent;
import com.company.haloshop.notificationEvent.AuctionResultCreatedEvent;
import com.company.haloshop.notificationEvent.DeliveryTrackingUpdateEvent;
import com.company.haloshop.notificationEvent.InquiryAnsweredEvent;
import com.company.haloshop.notificationEvent.MembershipUpdatedEvent;
import com.company.haloshop.notificationEvent.PointLogCreatedEvent;
import com.company.haloshop.notificationEvent.SeasonStartEvent;
import com.company.haloshop.order.OrderMapper;
import com.company.haloshop.orderitem.OrderItemMapper;
import com.company.haloshop.season.Season;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final AuctionLogMapper auctionLogMapper;
    private final AccountMapper accountMapper;
    private final OrderItemMapper orderItemMapper;
    private final OrderMapper orderMapper;

    // 포인트 내역 생성 이벤트
    @EventListener
    public void handlePointLogCreated(PointLogCreatedEvent event) {
    	PointLogDto pointLogDto = event.getPointLogDto();
    	NotificationRequestDto dto = new NotificationRequestDto();
    	
    	Long statusCode;
    	switch (pointLogDto.getType()) {
    	
    		case "SAVE" : case "REVIEW" : case "MEMBERSHIP_REWARD" :
    			statusCode = 601L; break;
    			
    		case "DONATE" :
    			statusCode = 602L; break;
    			
    		case "USE" : return;
    			
    		default:
    	        throw new IllegalArgumentException("Type 값 불명");	
    	}
    	
    	    	
    	dto.setReceiverId(pointLogDto.getAccountId());
    	dto.setEntityId(statusCode);
    	dto.setReferenceId(pointLogDto.getId());
    	
    	notificationService.createNotification(dto);
    }
    
    
    // 옥션 결과 이벤트
    @EventListener
    public void handleAuctionResultCreated(AuctionResultCreatedEvent event) {
        NotificationRequestDto dto = new NotificationRequestDto();
        dto.setReceiverId(event.getReceiverId());
        dto.setEntityId(201L); // 경매 낙찰 알림 엔티티 ID
        dto.setReferenceId(event.getAuctionId());

        notificationService.createNotification(dto); // DB 저장 + NotificationEvent 발행
    }
    
    //옥션 취소 이벤트
    @EventListener
    public void handleAuctionCanceled(AuctionCanceledEvent event) {
        Long auctionId = event.getAuctionId();

        // 참여자 전체 조회
        List<AuctionLog> participants = auctionLogMapper.selectByAuctionId(auctionId);

        // 참여자의 accountId만 추출 후 중복 제거
        Set<Long> uniqueAccountIds = participants.stream()
                .map(AuctionLog::getAccountId)
                .collect(Collectors.toSet());

        // 알림 생성 및 발행
        for (Long accountId : uniqueAccountIds) {
            NotificationRequestDto dto = new NotificationRequestDto();
            dto.setReceiverId(accountId);
            dto.setEntityId(203L); // 예: 경매 취소 알림 엔티티 ID
            dto.setReferenceId(auctionId);

            notificationService.createNotification(dto);
        }
    }
    
    // 시즌 시작 발행
    @EventListener
    public void handleSeasonStart(SeasonStartEvent event) {
    	Season season = event.getSeason();
    	List<AccountDto> allAccounts = accountMapper.selectAll();
    	
    	 for (AccountDto account : allAccounts) {
	    	NotificationRequestDto dto = new NotificationRequestDto();
	    	dto.setReceiverId(account.getId());
	    	dto.setEntityId(301L);
	    	dto.setReferenceId(season.getId());
	    	
	    	notificationService.createNotification(dto);
    	 }
    }
    
    // 배송 상태 발행
    @EventListener
    public void handleDeliveryTrackingUpdate(DeliveryTrackingUpdateEvent event) {
    	DeliveryTrackingDTO tracking = event.getDeliveryTrackingDTO();    	
    	NotificationRequestDto dto = new NotificationRequestDto();
    	
    	// 배송 상태에 따른 분기
    	Long statusCode;
    	switch (tracking.getStatus()) {
    	    case "출고됨": statusCode = 401L; break;
    	    case "배송중": statusCode = 402L; break;
    	    case "배송완료": statusCode = 403L; break;
    	    default:
    	        throw new IllegalArgumentException("알 수 없는 배송 상태");
    	}
    	
    	OrderItemDto orderItem = orderItemMapper.findById(tracking.getOrderItemsId());
    	OrderDto order = orderMapper.findById(orderItem.getOrdersId());
    	
    	dto.setReceiverId(order.getAccountId());
    	dto.setEntityId(statusCode);
    	dto.setReferenceId(orderItem.getId());
    	
    	notificationService.createNotification(dto);
    }
    
    @EventListener
    public void handleMembershipUpdated(MembershipUpdatedEvent event) {
    	UserPointDto userpointDto = event.getUserPointDto();
    	NotificationRequestDto dto = new NotificationRequestDto();
    	
    	
    }
    
    
    // 문의 답변 이벤트
    @EventListener
    public void handleInquiryAnswered(InquiryAnsweredEvent event) {
        NotificationRequestDto dto = new NotificationRequestDto();
        dto.setReceiverId(event.getReceiverId());
        dto.setEntityId(event.getEventEntityId());
        dto.setReferenceId(event.getInquiryId());

        notificationService.createNotification(dto);
    }
    
    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        Notification notification = event.getNotification();
        if (notification == null || notification.getReceiver() == null) return;

        String destination = "/topic/notifications/" + notification.getReceiver().getId();

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setReceiverId(notification.getReceiver().getId());
        dto.setEntityId(notification.getEntity().getId());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        messagingTemplate.convertAndSend(destination, dto); // 실시간 푸시
    }
}
