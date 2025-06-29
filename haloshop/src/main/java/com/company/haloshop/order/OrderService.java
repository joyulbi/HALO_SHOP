package com.company.haloshop.order;

import com.company.haloshop.dto.shop.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;

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
}
