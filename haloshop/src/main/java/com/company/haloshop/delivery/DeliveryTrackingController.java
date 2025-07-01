package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.shop.DeliveryTrackingDTO;

@RestController
@RequestMapping("/api/delivery-tracking")
public class DeliveryTrackingController {
	@Autowired
	private DeliveryTrackingService deliveryTrackingService;
	
    @PostMapping
    public ResponseEntity<String> insertTracking(@RequestBody DeliveryTrackingDTO tracking) {
        deliveryTrackingService.insertTracking(tracking);
        return ResponseEntity.ok("배송추적 등록 완료");
    }

    @GetMapping("/order/{orderItemsId}")
    public ResponseEntity<DeliveryTrackingDTO> getTracking(@PathVariable("orderItemsId") Long orderItemsId) {
        DeliveryTrackingDTO dto = deliveryTrackingService.getTrackingByOrderItemsId(orderItemsId);
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<String> updateStatus(@RequestBody DeliveryTrackingDTO tracking) {
        deliveryTrackingService.updateStatus(tracking);
        return ResponseEntity.ok("배송 상태 갱신 완료");
    }
    
    @GetMapping("user/{accountId}")
    public ResponseEntity<List<DeliveryTrackingDTO>> getTrackingByAccountId(@PathVariable("accountId") Long accountId) {
    	List<DeliveryTrackingDTO> trackings = deliveryTrackingService.getTrackingListByAccountId(accountId);
    	return ResponseEntity.ok(trackings);
    }
}

