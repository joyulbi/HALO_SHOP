package com.company.haloshop.delivery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.company.haloshop.dto.shop.DeliveryTracking;

@Controller
@RequestMapping("/api/delivery-tracking")
public class DeliveryTrackingController {
	@Autowired
	private DeliveryTrackingService deliveryTrackingService;
	
    @PostMapping
    public String insertTracking(@RequestBody DeliveryTracking tracking) {
        deliveryTrackingService.insertTracking(tracking);
        return "배송추적 등록 완료";
    }

    @GetMapping("/order/{orderItemsId}")
    public DeliveryTracking getTracking(@PathVariable Long orderItemsId) {
        return deliveryTrackingService.getTrackingByOrderItemsId(orderItemsId);
    }

    @PutMapping
    public String updateStatus(@RequestBody DeliveryTracking tracking) {
        deliveryTrackingService.updateStatus(tracking);
        return "배송 상태 갱신 완료";
    }
}
