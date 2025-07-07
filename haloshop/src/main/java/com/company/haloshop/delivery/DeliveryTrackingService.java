package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	
	public void updateTracking(DeliveryTrackingDTO tracking) {
		deliveryTrackingMapper.updateStatus(tracking);
	}
	
	public List<DeliveryTrackingDTO> getTrackingListByAccountId(Long accountId) {
		return deliveryTrackingMapper.selectByAccountId(accountId);
	}
}

