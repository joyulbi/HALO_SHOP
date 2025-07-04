package com.company.haloshop.delivery;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.shop.DeliveryTrackingDTO;

@Mapper
public interface DeliveryTrackingMapper {
	void insertTracking(DeliveryTrackingDTO tracking);
	DeliveryTrackingDTO findByOrderItemsId(Long orderItemsId);
	void updateStatus(DeliveryTrackingDTO tracking);
	List<DeliveryTrackingDTO> selectByAccountId(@Param("accountId") Long accountId);
}

