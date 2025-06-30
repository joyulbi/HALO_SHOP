package com.company.haloshop.order;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderItemDto;
import com.company.haloshop.dto.shop.OrderRequestDto;
import com.company.haloshop.orderitem.OrderItemMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper; // order_items insert용으로 주입 추가

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
        // 주문 insert
        orderMapper.insert(orderRequestDto);
        Long orderId = orderRequestDto.getId();

        // 주문 아이템 리스트 insert
        for (OrderItemDto itemDto : orderRequestDto.getOrderItems()) {
            itemDto.setOrdersId(orderId);
            orderItemMapper.insert(itemDto);
        }
    }
}
