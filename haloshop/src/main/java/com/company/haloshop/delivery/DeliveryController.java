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
}
