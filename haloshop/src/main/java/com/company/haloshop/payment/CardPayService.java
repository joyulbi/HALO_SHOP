package com.company.haloshop.payment;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.order.OrderMapper;
import com.company.haloshop.pointlog.PointLogService;
import com.company.haloshop.userpoint.UserPointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardPayService {

    private final OrderMapper orderMapper;
    private final UserPointService userPointService;
    private final PointLogService pointLogService;

    /**
     * CARD(mock) 결제 승인 처리
     * @param orderId 승인할 주문 ID
     */
    @Transactional
    public void approve(Long orderId) {
        OrderDto order = orderMapper.findById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("해당 주문이 존재하지 않습니다.");
        }

        if (!"PENDING".equals(order.getPaymentStatus())) {
            throw new IllegalStateException("이미 결제 완료된 주문이거나 승인할 수 없는 상태입니다.");
        }

        // 1️⃣ 결제 상태 PAID로 변경
        orderMapper.updateStatus(orderId, "PAID");
        log.info("CARD(mock) 결제 승인 완료: Order ID={}, User ID={}", orderId, order.getAccountId());

        // 2️⃣ 포인트 적립 (payAmount 기준)
        int savePoint = userPointService.updateUserPointAndGrade(order.getAccountId(), order.getPayAmount());
        if (savePoint > 0) {
            pointLogService.saveLog(order.getAccountId(), "SAVE", savePoint);
            log.info("포인트 적립 완료: {}P, User ID={}", savePoint, order.getAccountId());
        } else {
            log.info("적립할 포인트가 없어 적립하지 않음, User ID={}", order.getAccountId());
        }
    }

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

        // 2️⃣ 적립된 포인트 회수 (payAmount 기준)
        int refundPoint = userPointService.deductPointByOrder(order.getAccountId(), order.getPayAmount());
        pointLogService.saveLog(order.getAccountId(), "REFUND_DEDUCT", refundPoint);
        log.info("포인트 회수 완료: {}P, User ID={}", refundPoint, order.getAccountId());

        // 3️⃣ 사용한 포인트 복원
        if (order.getAmount() != null && order.getAmount() > 0) {
            userPointService.restorePoint(order.getAccountId(), order.getAmount());
            pointLogService.saveLog(order.getAccountId(), "REFUND_RESTORE", order.getAmount());
            log.info("사용 포인트 복원 완료: {}P, User ID={}", order.getAmount(), order.getAccountId());
        }
    }

}
