package com.company.haloshop.order;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderRequestDto;

@Mapper
public interface OrderMapper {
	void insert(OrderRequestDto orderRequestDto);

    List<OrderDto> findAll();

    OrderDto findById(Long id);

    void insert(OrderDto orderDto);

    void update(OrderDto orderDto);

    void delete(Long id);
}
