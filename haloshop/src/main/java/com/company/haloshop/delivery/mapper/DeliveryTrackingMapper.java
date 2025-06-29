package com.company.haloshop.delivery.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.DeliveryTracking;

@Mapper
public interface DeliveryTrackingMapper {
	void insertTracking(DeliveryTracking tracking);
	DeliveryTracking findByOrderItemsId(Long orderItemsId);
	void updateStatus(DeliveryTracking tracking);
}
