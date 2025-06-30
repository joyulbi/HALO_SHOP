package com.company.haloshop.orderitem;

import com.company.haloshop.dto.shop.OrderItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemMapper orderItemMapper;

    public List<OrderItemDto> findAll() {
        return orderItemMapper.findAll();
    }

    public OrderItemDto findById(Long id) {
        return orderItemMapper.findById(id);
    }

    public void insert(OrderItemDto orderItemDto) {
        orderItemMapper.insert(orderItemDto);
    }

    public void update(OrderItemDto orderItemDto) {
        orderItemMapper.update(orderItemDto);
    }

    public void delete(Long id) {
        orderItemMapper.delete(id);
    }
}
