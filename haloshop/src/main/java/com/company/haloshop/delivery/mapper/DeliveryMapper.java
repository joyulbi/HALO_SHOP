package com.company.haloshop.delivery.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.DeliveryDTO;

@Mapper
public interface DeliveryMapper {
	void insertDelivery(DeliveryDTO delivery);
	List<DeliveryDTO> findByUserId(Long userId);
}

