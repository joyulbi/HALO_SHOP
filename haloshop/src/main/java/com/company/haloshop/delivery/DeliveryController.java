package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.shop.DeliveryDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {
	@Autowired
	private DeliveryService deliveryService;
	
	@PostMapping
	public ResponseEntity<String> insertDelivery(@RequestBody DeliveryDTO delivery) {
		deliveryService.insertDelivery(delivery);
		return ResponseEntity.ok("배송지 등록 완료");
	}
	
	@GetMapping("/user/{accountId}")
	public ResponseEntity<List<DeliveryDTO>> getDeliveries(@PathVariable("accountId") Long accountId) {
		List<DeliveryDTO> deliveries = deliveryService.getDeliveriesByUser(accountId);
		return ResponseEntity.ok(deliveries);
	}
	
	@GetMapping("/admin/deliveries")
	public ResponseEntity<List<DeliveryDTO>> getAllDeliveries() {
	    List<DeliveryDTO> deliveries = deliveryService.getAllDeliveries();
	    return ResponseEntity.ok(deliveries);
	}
}
