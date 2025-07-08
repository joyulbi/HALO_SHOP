package com.company.haloshop.delivery;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.DeliveryDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/deliveries") // ✅ RESTful: 복수형 사용
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    // ✅ 배송지 등록
    @PostMapping
    public ResponseEntity<String> insertDelivery(@RequestBody DeliveryDTO delivery) {
        deliveryService.insertDelivery(delivery);
        return ResponseEntity.ok("배송지 등록 완료");
    }

    // ✅ 특정 사용자 배송 목록 조회
    @GetMapping("/{accountId}")
    public ResponseEntity<List<DeliveryDTO>> getDeliveriesByUser(@PathVariable Long accountId) {
        List<DeliveryDTO> deliveries = deliveryService.getDeliveriesByUser(accountId);
        return ResponseEntity.ok(deliveries);
    }
    
    // ✅ 결제 완료 후 배송 상태 업데이트 (배송준비중)
    public ResponseEntity<String> updateDeliveryStatus(@PathVariable Long orderItemId) {
    	try {
    		deliveryService.updateDeliveryStatus(orderItemId, "배송준비중");
    		return ResponseEntity.ok("배송 상태가 '배송준비중'으로 업데이트 되었습니다.");
    	} catch (Exception e) {
    		return ResponseEntity.status(500).body("배송 상태 업데이트 실패: " + e.getMessage());
    	}
    }
}
