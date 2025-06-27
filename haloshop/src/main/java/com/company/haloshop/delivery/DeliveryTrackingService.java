package com.company.haloshop.delivery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.DeliveryTracking;

@Service
public class DeliveryTrackingService {
	@Autowired
	private DeliveryTrackingMapper deliveryTrackingMapper;
	
	public void insertTracking(DeliveryTracking tracking) {
		deliveryTrackingMapper.insertTracking(tracking);
	}
	
	public DeliveryTracking getTrackingByOrderItemsId(Long orderItemsId) {
		return deliveryTrackingMapper.findByOrderItemsId(orderItemsId);
	}
	
	public void updateStatus(DeliveryTracking tracking) {
		deliveryTrackingMapper.updateStatus(tracking);
	}
}
