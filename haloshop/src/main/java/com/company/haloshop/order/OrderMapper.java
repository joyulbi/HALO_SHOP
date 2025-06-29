package com.company.haloshop.order;

import com.company.haloshop.dto.shop.OrderDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMapper {

    List<OrderDto> findAll();

    OrderDto findById(Long id);

    void insert(OrderDto orderDto);

    void update(OrderDto orderDto);

    void delete(Long id);
}
