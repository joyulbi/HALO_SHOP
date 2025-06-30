package com.company.haloshop.delivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.company.haloshop.delivery.service.DeliveryService;
import com.company.haloshop.dto.shop.DeliveryDTO;

@Controller
@RequestMapping("/api/delivery")
public class DeliveryController {
	@Autowired
	private DeliveryService deliveryService;
	
	@PostMapping
	public String insertDelivery(@RequestBody DeliveryDTO delivery) {
		deliveryService.insertDelivery(delivery);
		return "배송지 등록 완료";
	}
	
	@GetMapping("/user/{accountId}")
	public List<DeliveryDTO> getDeliveries(@PathVariable("accountId") Long accountId) {
		return deliveryService.getDeliveriesByUser(accountId);
	}
}

