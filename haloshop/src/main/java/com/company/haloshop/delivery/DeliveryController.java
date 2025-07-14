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

    // ✅ 기본 배송지 설정 (회원가입 시 기본 배송지 설정)
    @PostMapping("/set-default")
    public ResponseEntity<String> setDefaultDeliveryAddress(@RequestBody DeliveryDTO deliveryDTO) {
        try {
            // 기본 배송지가 이미 존재하는지 확인하고, 존재하면 업데이트
            deliveryService.addDefaultDelivery(deliveryDTO);
            return ResponseEntity.ok("기본 배송지가 설정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("기본 배송지 설정 실패: " + e.getMessage());
        }
    }

    // ✅ 기본 배송지 조회 (상품 추가 시 기본 배송지 조회)
    @GetMapping("/{accountId}/default")
    public ResponseEntity<DeliveryDTO> getDefaultDeliveryAddress(@PathVariable Long accountId) {
        try {
            // 기본 배송지를 찾는 메소드 호출
            DeliveryDTO delivery = deliveryService.getDefaultDeliveryAddress(accountId);
            return ResponseEntity.ok(delivery);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);  // 서버 오류 시
        }
    }

    // ✅ 배송지 등록
    @PostMapping
    public ResponseEntity<String> insertDelivery(@RequestBody DeliveryDTO delivery) {
        try {
            deliveryService.insertDelivery(delivery); // 배송지 등록
            return ResponseEntity.ok("배송지 등록 완료");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("배송지 등록 실패: " + e.getMessage());
        }
    }

    // ✅ 특정 사용자 배송 목록 조회
    @GetMapping("/{accountId}")
    public ResponseEntity<List<DeliveryDTO>> getDeliveriesByUser(@PathVariable Long accountId) {
        try {
            List<DeliveryDTO> deliveries = deliveryService.getDeliveriesByUser(accountId);
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 에러 발생 시 null 반환
        }
    }

    // ✅ 결제 완료 후 배송 상태 업데이트 (배송준비중)
    @PutMapping("/{orderItemId}/status")  // HTTP PUT으로 상태 업데이트
    public ResponseEntity<String> updateDeliveryStatus(
            @PathVariable Long orderItemId, @RequestParam String status) { // 상태 파라미터로 받기
        try {
            // 유효한 배송 상태인지 체크하는 메소드 추가
            if (!isValidStatus(status)) {
                return ResponseEntity.status(400).body("유효하지 않은 배송 상태입니다.");
            }

            deliveryService.updateDeliveryStatus(orderItemId, status); // 상태 업데이트
            return ResponseEntity.ok("배송 상태가 '" + status + "'으로 업데이트 되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("배송 상태 업데이트 실패: " + e.getMessage());
        }
    }

    // ✅ 배송 상태가 유효한지 확인하는 메소드
    private boolean isValidStatus(String status) {
        return "배송준비중".equals(status) || "출고됨".equals(status) || "배송중".equals(status) || "배송완료".equals(status);
    }
}
