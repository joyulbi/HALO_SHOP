package com.company.haloshop.delivery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.haloshop.delivery.mapper.DeliveryTrackingMapper;
import com.company.haloshop.dto.shop.DeliveryTrackingDTO;

@Service
public class DeliveryTrackingService {
	@Autowired
	private DeliveryTrackingMapper deliveryTrackingMapper;
	
	public void insertTracking(DeliveryTrackingDTO tracking) {
		deliveryTrackingMapper.insertTracking(tracking);
	}
	
	public DeliveryTrackingDTO getTrackingByOrderItemsId(Long orderItemsId) {
		return deliveryTrackingMapper.findByOrderItemsId(orderItemsId);
	}
	
	public void updateStatus(DeliveryTrackingDTO tracking) {
		deliveryTrackingMapper.updateStatus(tracking);
	}
}

