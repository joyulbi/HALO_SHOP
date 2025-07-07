package com.company.haloshop.order;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderRequestDto;
import com.company.haloshop.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDto>> findAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> findById(@PathVariable Long id,
                                             @AuthenticationPrincipal CustomUserDetails user) {
        OrderDto order = orderService.findById(id);
        if (!order.getAccountId().equals(user.getId())) {
            throw new AccessDeniedException("본인 주문만 조회할 수 있습니다.");
        }
        return ResponseEntity.ok(order);
    }

    /*@PostMapping
    public ResponseEntity<Void> insert(@RequestBody OrderDto orderDto) {
        orderService.insert(orderDto);
        return ResponseEntity.ok().build();
    }*/
    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody OrderRequestDto orderRequestDto) {
        Long savedOrderId = orderService.insertOrderWithItems(orderRequestDto);
        return ResponseEntity.ok(Map.of("orderId", savedOrderId));
    }



    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody OrderDto orderDto) {
        orderDto.setId(id); // 경로 ID를 DTO에 주입
        orderService.update(orderDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                        @AuthenticationPrincipal CustomUserDetails user) {
        orderService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<OrderDto>> findMyOrders(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(orderService.findByAccountId(user.getId()));
    }
    
    @PutMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id,
    											 @RequestBody Map<String, String> body,
    											 @AuthenticationPrincipal CustomUserDetails user) {
    	String paymentStatus = body.get("paymentStatus");
    	
    	// user null 체크 (비로그인 요청 처리)
    	if (user == null) {
    		return ResponseEntity.status(401).body("로그인이 필요합니다.");
    	}
    	
    	// order null 체크
    	OrderDto order = orderService.findById(id);
    	if (order == null) {
    		return ResponseEntity.status(404).body("해당 주문이 존재하지 않습니다.");
    	}
    	
    	// 권한 체크 (본인 주문만 수정 가능)
    	if (!order.getAccountId().equals(user.getId())) {
    		throw new AccessDeniedException("본인 주문만 결제 상태를 수정할 수 있습니다.");
    	}
    	
    	orderService.updatePaymentStatus(id, paymentStatus);
    	return ResponseEntity.ok("결제 상태 업데이트 완료");
    }
}
