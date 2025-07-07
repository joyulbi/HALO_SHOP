package com.company.haloshop.order;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderItemDto;
import com.company.haloshop.dto.shop.OrderRequestDto;
import com.company.haloshop.orderitem.OrderItemMapper;
import com.company.haloshop.pointlog.PointLogService;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final UserPointService userPointService;
    private final PointLogService pointLogService;

    public List<OrderDto> findAll() {
        return orderMapper.findAll();
    }
    public List<OrderDto> findByAccountId(Long accountId) {
        return orderMapper.findByAccountId(accountId);
    }


    public OrderDto findById(Long id) {
        OrderDto order = orderMapper.findById(id);
        List<OrderItemDto> items = orderItemMapper.findByOrderId(id);
        order.setOrderItems(items);
        return order;
    }

    public void insert(OrderDto orderDto) {
        orderMapper.insert(orderDto);
    }

    public void update(OrderDto orderDto) {
        orderMapper.update(orderDto);
    }

    @Transactional
    public void delete(Long id, Long accountId) {
        OrderDto order = orderMapper.findById(id);
        if (order == null) {
            throw new IllegalArgumentException("주문이 존재하지 않습니다.");
        }
        if (!order.getAccountId().equals(accountId)) {
            throw new SecurityException("본인 주문만 삭제할 수 있습니다.");
        }
        if ("PAID".equals(order.getPaymentStatus())) {
            throw new IllegalStateException("이미 결제 완료된 주문은 삭제할 수 없습니다.");
        }
        orderMapper.delete(id);
    }



    @Transactional
    public Long insertOrderWithItems(OrderRequestDto orderRequestDto) {

        // ✅ 1) payAmount 계산 (결제금액 = 총 주문금액 - 사용포인트)
        long payAmount = orderRequestDto.getTotalPrice() -
                (orderRequestDto.getAmount() != null ? orderRequestDto.getAmount() : 0);
        orderRequestDto.setPayAmount(payAmount);

        // ✅ 2) 주문 INSERT
        orderMapper.insertOrderWithItems(orderRequestDto);
        Long orderId = orderRequestDto.getId();

        // ✅ 3) 주문 아이템 INSERT
        List<OrderItemDto> orderItems = orderRequestDto.getOrderItems();
        if (orderItems == null || orderItems.isEmpty()) {
            throw new IllegalArgumentException("주문 아이템이 없습니다.");
        }
        for (OrderItemDto itemDto : orderItems) {
            itemDto.setOrdersId(orderId);
            orderItemMapper.insert(itemDto);
        }

        Long accountId = orderRequestDto.getAccountId();

        // ✅ 4) 포인트 사용 처리 및 사용 로그 기록
        if (orderRequestDto.getAmount() != null && orderRequestDto.getAmount() > 0) {
            userPointService.usePoint(accountId, orderRequestDto.getAmount());
            pointLogService.saveLog(accountId, "USE", orderRequestDto.getAmount());
        }

        // ✅ 5) 포인트 적립 및 멤버십 갱신 (결제금액(payAmount) 기준으로 적립)
       // int savePoint = userPointService.updateUserPointAndGrade(accountId, payAmount);

        // ✅ 6) 적립 포인트 로그 기록
        //if (savePoint > 0) {
            //pointLogService.saveLog(accountId, "SAVE", savePoint);
       // }
        return orderId;
    }
    
    @Transactional
    public void updatePaymentStatus(Long orderId, String paymentStatus) {
        orderMapper.updateStatus(orderId, paymentStatus);
    }



}
