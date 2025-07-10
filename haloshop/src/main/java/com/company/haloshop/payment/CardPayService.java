package com.company.haloshop.payment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.cart.CartService;
import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.order.OrderMapper;
import com.company.haloshop.order.OrderService;
import com.company.haloshop.pointlog.PointLogService;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardPayService {

    private final OrderMapper orderMapper;
    private final OrderService orderService;
    private final UserPointService userPointService;
    private final PointLogService pointLogService;
    private final CartService cartService;

    /**
     * CARD(mock) 결제 승인 처리
     * @param orderId 승인할 주문 ID
     */
    @Transactional
    public void approve(Long orderId) {
        OrderDto order = orderMapper.findById(orderId);

        if (!"PENDING".equals(order.getPaymentStatus())) {
            throw new IllegalStateException("이미 결제 완료된 주문이거나 승인할 수 없는 상태입니다.");
        }

        // ✅ 주문 상태 업데이트 + 재고 차감 연동
        orderService.updatePaymentStatus(orderId, "PAID");
        cartService.clearCartByAccountId(order.getAccountId());

        if ("MOCK".equals(order.getUsed()) || "CARD".equals(order.getUsed())) {
            OrderDto updatedOrder = orderMapper.findById(orderId);
            if ("PAID".equals(updatedOrder.getPaymentStatus())) {
                Long accountId = updatedOrder.getAccountId();
                Long payAmount = updatedOrder.getPayAmount();
                int savePoint = userPointService.updateUserPoint(accountId, payAmount);

                if (savePoint > 0) {
                    pointLogService.saveLog(accountId, "SAVE", savePoint);
                }
            }
        }
    }

    /**
     * CARD(mock) 결제 취소 처리
     * @param orderId 취소할 주문 ID
     */
    @Transactional
    public void cancel(Long orderId) {
        OrderDto order = orderMapper.findById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("해당 주문이 존재하지 않습니다.");
        }

        if (!"PAID".equals(order.getPaymentStatus())) {
            throw new IllegalStateException("결제 완료된 주문만 취소할 수 있습니다.");
        }

        // 1️⃣ 주문 상태 CANCELLED로 변경
        orderMapper.updateStatus(orderId, "CANCELLED");
        log.info("CARD(mock) 결제 취소 완료: Order ID={}, User ID={}", orderId, order.getAccountId());

        // 2️⃣ 적립된 포인트 회수
        int refundPoint = userPointService.deductPointByOrder(order.getAccountId(), order.getPayAmount());
        log.info("포인트 회수 완료: {}P, User ID={}", refundPoint, order.getAccountId());

        // 3️⃣ 사용한 포인트 복원
        if (order.getAmount() != null && order.getAmount() > 0) {
            userPointService.restorePoint(order.getAccountId(), order.getAmount());
            log.info("사용 포인트 복원 완료: {}P, User ID={}", order.getAmount(), order.getAccountId());
        }
    }
}
