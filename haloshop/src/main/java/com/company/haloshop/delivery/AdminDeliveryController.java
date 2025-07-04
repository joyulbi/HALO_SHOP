package com.company.haloshop.delivery;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.shop.DeliveryDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/deliveries")
@RequiredArgsConstructor
public class AdminDeliveryController {

    private final DeliveryService deliveryService;

    // ✅ 관리자 전체 배송 목록 조회
    @GetMapping
    public List<DeliveryDTO> getAllDeliveriesForAdmin() {
        return deliveryService.getAllDeliveriesWithOrderInfo();
    }

    // ✅ 관리자 배송 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDelivery(@PathVariable Long id) {
        try {
            deliveryService.deleteDelivery(id);
            return ResponseEntity.ok("배송 삭제 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("배송 삭제 실패: " + e.getMessage());
        }
    }

    // ✅ 관리자 배송상태 수정
    @PutMapping("/{orderItemId}/status")
    public ResponseEntity<String> updateDeliveryStatus(@PathVariable Long orderItemId, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        deliveryService.updateDeliveryStatus(orderItemId, status);
        return ResponseEntity.ok("배송 상태가 수정되었습니다.");
    }

}
