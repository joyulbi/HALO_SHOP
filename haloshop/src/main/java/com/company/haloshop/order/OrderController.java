package com.company.haloshop.order;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderRequestDto;
import com.company.haloshop.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * ✅ 관리자만 전체 주문 조회 가능
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> findAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    /**
     * ✅ 관리자: 모든 주문 상세 조회 가능
     * ✅ 일반 사용자: 본인 주문만 상세 조회 가능
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> findById(@PathVariable Long id,
                                             @AuthenticationPrincipal CustomUserDetails user) {
        OrderDto order = orderService.findById(id);

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !order.getAccountId().equals(user.getId())) {
            throw new AccessDeniedException("본인 주문만 조회할 수 있습니다.");
        }

        return ResponseEntity.ok(order);
    }

    /**
     * ✅ 주문 생성
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody OrderRequestDto orderRequestDto) {
        Long savedOrderId = orderService.insertOrderWithItems(orderRequestDto);
        return ResponseEntity.ok(Map.of("orderId", savedOrderId));
    }

    /**
     * ✅ 주문 정보 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody OrderDto orderDto) {
        orderDto.setId(id);
        orderService.update(orderDto);
        return ResponseEntity.ok().build();
    }

    /**
     * ✅ 관리자: 모든 주문 삭제 가능
     * ✅ 일반 사용자: 본인 주문만 삭제 가능
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal CustomUserDetails user) {
        OrderDto order = orderService.findById(id);

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !order.getAccountId().equals(user.getId())) {
            throw new AccessDeniedException("본인 주문만 삭제할 수 있습니다.");
        }

        orderService.delete(id, order.getAccountId());
        return ResponseEntity.noContent().build();
    }

    /**
     * ✅ 본인 주문 목록 조회
     */
    @GetMapping("/my")
    public ResponseEntity<List<OrderDto>> findMyOrders(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(orderService.findByAccountId(user.getId()));
    }
}
