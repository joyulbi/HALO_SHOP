package com.company.haloshop.order;

import java.util.List;

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

    public OrderDto findById(Long id) {
        return orderMapper.findById(id);
    }

    public void insert(OrderDto orderDto) {
        orderMapper.insert(orderDto);
    }

    public void update(OrderDto orderDto) {
        orderMapper.update(orderDto);
    }

    public void delete(Long id) {
        orderMapper.delete(id);
    }

    @Transactional
    public void insertOrderWithItems(OrderRequestDto orderRequestDto) {
        orderMapper.insert(orderRequestDto);
        Long orderId = orderRequestDto.getId();

        for (OrderItemDto itemDto : orderRequestDto.getOrderItems()) {
            itemDto.setOrdersId(orderId);
            orderItemMapper.insert(itemDto);
        }

        Long accountId = orderRequestDto.getAccountId();
        Long totalPrice = orderRequestDto.getTotalPrice();

        // 주문 완료 시 포인트 적립 및 등급 갱신
        userPointService.updateUserPointAndGrade(accountId, totalPrice);

        // 적립 포인트 로그 기록 (UserPointService 내부 로직과 동일 적립량 유지 필요 시 로직 공유 권장)
        Long savePoint = totalPrice / 100; // 1% 기본 적립
        pointLogService.saveLog(accountId, "SAVE", savePoint.intValue());
    }
}
