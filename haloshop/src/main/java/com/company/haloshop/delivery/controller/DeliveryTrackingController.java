package com.company.haloshop.delivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.company.haloshop.delivery.service.DeliveryTrackingService;
import com.company.haloshop.dto.shop.DeliveryTrackingDTO;

@Controller
@RequestMapping("/api/delivery-tracking")
public class DeliveryTrackingController {
	@Autowired
	private DeliveryTrackingService deliveryTrackingService;
	
    @PostMapping
    public String insertTracking(@RequestBody DeliveryTrackingDTO tracking) {
        deliveryTrackingService.insertTracking(tracking);
        return "배송추적 등록 완료";
    }

    @GetMapping("/order/{orderItemsId}")
    public DeliveryTrackingDTO getTracking(@PathVariable("orderItemsId") Long orderItemsId) {
        return deliveryTrackingService.getTrackingByOrderItemsId(orderItemsId);
    }

    @PutMapping
    public String updateStatus(@RequestBody DeliveryTrackingDTO tracking) {
        deliveryTrackingService.updateStatus(tracking);
        return "배송 상태 갱신 완료";
    }
}

