package com.company.haloshop.delivery;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.DeliveryDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryMapper deliveryMapper;

    // ✅ 사용자 배송 등록
    public void insertDelivery(DeliveryDTO delivery) {
        deliveryMapper.insertDelivery(delivery);
    }

    // ✅ 특정 사용자 배송 목록 조회
    public List<DeliveryDTO> getDeliveriesByUser(Long accountId) {
        return deliveryMapper.findByAccountId(accountId);
    }

    // ✅ 관리자 전체 배송 목록 조회 (주문 정보 포함)
    public List<DeliveryDTO> getAllDeliveriesWithOrderInfo() {
        return deliveryMapper.findAllDeliveriesWithOrderInfo();
    }

    // ✅ 단일 배송 조회
    public DeliveryDTO getDeliveryById(Long id) {
        return deliveryMapper.findById(id);
    }

    // ✅ 배송 수정
    @Transactional
    public void updateDelivery(DeliveryDTO delivery) {
        if (deliveryMapper.findById(delivery.getId()) == null) {
            throw new IllegalArgumentException("배송 정보가 존재하지 않습니다.");
        }
        deliveryMapper.updateDelivery(delivery);
    }

    // ✅ 배송 삭제
    @Transactional
    public void deleteDelivery(Long id) {
        if (deliveryMapper.findById(id) == null) {
            throw new IllegalArgumentException("배송 정보가 존재하지 않습니다.");
        }
        deliveryMapper.deleteDelivery(id);
    }
    
    // ✅ 배송상태 수정
    @Transactional
    public void updateDeliveryStatus(Long orderItemId, String status) {
    	DeliveryDTO delivery = deliveryMapper.findByOrderItemId(orderItemId);
    	
    	if (delivery == null) {
    		throw new IllegalArgumentException("주문 항목이 존재하지 않습니다.");
    	}
    	
    	if (Objects.equals(delivery.getDeliveryStatus(), status)) {
    		throw new IllegalArgumentException("이미 배송 상태가 " + status + "입니다.");
    	}
        deliveryMapper.updateDeliveryStatus(orderItemId, status);
    }

}