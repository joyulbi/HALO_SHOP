package com.company.haloshop.delivery.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.Delivery;

@Mapper
public interface DeliveryMapper {
	void insertDelivery(Delivery delivery);
	List<Delivery> findByUserId(Long userId);
}
