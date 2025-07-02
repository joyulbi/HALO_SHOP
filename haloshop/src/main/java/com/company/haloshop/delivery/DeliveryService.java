package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	
	public List<DeliveryDTO> getAllDeliveries() {
	    return deliveryMapper.findAll(); // mapper에 아래 메서드도 필요
	}

}

