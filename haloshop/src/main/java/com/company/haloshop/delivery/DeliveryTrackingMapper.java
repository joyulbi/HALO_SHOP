package com.company.haloshop.delivery;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.DeliveryTrackingDTO;

@Mapper
public interface DeliveryTrackingMapper {
	void insertTracking(DeliveryTrackingDTO tracking);
	DeliveryTrackingDTO findByOrderItemsId(Long orderItemsId);
	void updateStatus(DeliveryTrackingDTO tracking);
}

