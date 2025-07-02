package com.company.haloshop.orderitem;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.OrderItemDto;

@Mapper
public interface OrderItemMapper {
	

    List<OrderItemDto> findAll();

    OrderItemDto findById(Long id);

    void insert(OrderItemDto orderItemDto);

    void update(OrderItemDto orderItemDto);

    void delete(Long id);
    
    List<OrderItemDto> findAllByCategoryId(Long categoryId);
}
