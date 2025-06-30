package com.company.haloshop.delivery.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.haloshop.delivery.mapper.DeliveryMapper;
import com.company.haloshop.dto.shop.DeliveryDTO;

@Service
public class DeliveryService {
	@Autowired
	private DeliveryMapper deliveryMapper;
	
	public void insertDelivery(DeliveryDTO delivery) {
		deliveryMapper.insertDelivery(delivery);
	}
	
	public List<DeliveryDTO> getDeliveriesByUser(Long userId) {
		return deliveryMapper.findByUserId(userId);
	}
}

