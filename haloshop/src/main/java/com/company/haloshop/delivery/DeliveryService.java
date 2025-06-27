package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Delivery;

@Service
public class DeliveryService {
	@Autowired
	private DeliveryMapper deliveryMapper;
	
	public void insertDelivery(Delivery delivery) {
		deliveryMapper.insertDelivery(delivery);
	}
	
	public List<Delivery> getDeliveriesByUser(Long userId) {
		return deliveryMapper.findByUserId(userId);
	}
}
