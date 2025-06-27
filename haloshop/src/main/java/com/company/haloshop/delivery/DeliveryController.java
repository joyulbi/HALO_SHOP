package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.company.haloshop.dto.shop.Delivery;

@Controller
@RequestMapping("/api/delivery")
public class DeliveryController {
	@Autowired
	private DeliveryService deliveryService;
	
	@PostMapping
	public String insertDelivery(@RequestBody Delivery delivery) {
		deliveryService.insertDelivery(delivery);
		return "배송지 등록 완료";
	}
	
	@GetMapping("/user/{userId}")
	public List<Delivery> getDeliveries(@PathVariable Long userId) {
		return deliveryService.getDeliveriesByUser(userId);
	}
}
