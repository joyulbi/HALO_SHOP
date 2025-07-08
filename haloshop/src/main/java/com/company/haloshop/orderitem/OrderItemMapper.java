package com.company.haloshop.orderitem;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param; // ✅ 추가

import com.company.haloshop.dto.shop.OrderItemDto;

@Mapper
public interface OrderItemMapper {

    List<OrderItemDto> findAll();

    OrderItemDto findById(Long id);

    void insert(OrderItemDto orderItemDto);

    void update(OrderItemDto orderItemDto);

    void delete(Long id);

    List<OrderItemDto> findAllByCategoryId(Long categoryId);

    // ✅ @Param 추가하여 XML #{orderId} 와 매칭되도록 수정
    List<OrderItemDto> findByOrderId(@Param("orderId") Long ordersId);
}
