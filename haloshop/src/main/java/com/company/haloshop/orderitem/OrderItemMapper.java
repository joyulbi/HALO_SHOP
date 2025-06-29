package com.company.haloshop.orderitem;

import com.company.haloshop.dto.shop.OrderItemDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderItemMapper {

    List<OrderItemDto> findAll();

    OrderItemDto findById(Long id);

    void insert(OrderItemDto orderItemDto);

    void update(OrderItemDto orderItemDto);

    void delete(Long id);
}
