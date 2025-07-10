package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.DeliveryTrackingDTO;
import com.company.haloshop.entity.delivery.DeliveryTracking;
import com.company.haloshop.notificationEvent.DeliveryTrackingUpdateEvent;

@Service
public class DeliveryTrackingService {
	@Autowired
	private DeliveryTrackingMapper deliveryTrackingMapper;
	// 알림 이벤트
	@Autowired private ApplicationEventPublisher eventPublisher;
	
	public void insertTracking(DeliveryTrackingDTO tracking) {
		deliveryTrackingMapper.insertTracking(tracking);
		// 이벤트 발행
        eventPublisher.publishEvent(new DeliveryTrackingUpdateEvent(this, tracking));
	}
	
	public DeliveryTrackingDTO getTrackingByOrderItemsId(Long orderItemsId) {
		return deliveryTrackingMapper.findByOrderItemsId(orderItemsId);
	}
	
	public void updateTracking(DeliveryTrackingDTO tracking) {
		deliveryTrackingMapper.updateStatus(tracking);
		// 이벤트 발행
        eventPublisher.publishEvent(new DeliveryTrackingUpdateEvent(this, tracking));
	}
	
	public List<DeliveryTrackingDTO> getTrackingListByAccountId(Long accountId) {
		return deliveryTrackingMapper.selectByAccountId(accountId);
	}
}

