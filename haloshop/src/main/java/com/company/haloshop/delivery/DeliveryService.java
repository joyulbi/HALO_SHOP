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
        try {
            deliveryMapper.insertDelivery(delivery);
        } catch (Exception e) {
            throw new RuntimeException("배송지 등록 실패: " + e.getMessage());
        }
    }

    // ✅ 기본 배송지 추가 (회원가입 시 기본 배송지 설정)
    @Transactional
    public void addDefaultDelivery(DeliveryDTO deliveryDTO) {
        try {
            // 기본 배송지가 이미 설정된 경우 기존 배송지 삭제
            deliveryMapper.removeExistsingDefaultDelivery(deliveryDTO.getAccountId());

            // 새로운 기본 배송지 추가
            deliveryMapper.insertDefaultDeliveryAddress(deliveryDTO); 
        } catch (Exception e) {
            throw new RuntimeException("기본 배송지 설정 실패: " + e.getMessage());
        }
    }

    // ✅ 특정 사용자 배송 목록 조회
    public List<DeliveryDTO> getDeliveriesByUser(Long accountId) {
        List<DeliveryDTO> deliveries = deliveryMapper.findByAccountId(accountId);
        if (deliveries == null || deliveries.isEmpty()) {
            throw new IllegalArgumentException("등록된 배송지가 없습니다.");
        }
        return deliveries;
    }

    // ✅ 기본 배송지 조회
    public DeliveryDTO getDefaultDeliveryAddress(Long accountId) {
        try {
            DeliveryDTO delivery = deliveryMapper.findDefaultDeliveryByAccountId(accountId);

            // 기본 배송지가 잘 조회되었는지 확인
            if (delivery == null) {
                System.out.println("기본 배송지가 존재하지 않습니다.");
                return null;  // 클라이언트에서 null을 처리
            }

            return delivery;

        } catch (Exception e) {
            e.printStackTrace();
            return null;  // 기본 배송지 조회 실패 시 null 반환
        }
    }

    // ✅ 관리자 전체 배송 목록 조회 (주문 정보 포함)
    public List<DeliveryDTO> getAllDeliveriesWithOrderInfo() {
        return deliveryMapper.findAllDeliveriesWithOrderInfo();
    }

    // ✅ 단일 배송 조회
    public DeliveryDTO getDeliveryById(Long id) {
        DeliveryDTO delivery = deliveryMapper.findById(id);
        if (delivery == null) {
            throw new IllegalArgumentException("해당 배송 정보가 존재하지 않습니다.");
        }
        return delivery;
    }

    // ✅ 배송 수정
    @Transactional
    public void updateDelivery(DeliveryDTO delivery) {
        DeliveryDTO existingDelivery = deliveryMapper.findById(delivery.getId());
        if (existingDelivery == null) {
            throw new IllegalArgumentException("배송 정보가 존재하지 않습니다.");
        }
        deliveryMapper.updateDelivery(delivery);
    }

    // ✅ 배송 삭제
    @Transactional
    public void deleteDelivery(Long id) {
        DeliveryDTO existingDelivery = deliveryMapper.findById(id);
        if (existingDelivery == null) {
            throw new IllegalArgumentException("배송 정보가 존재하지 않습니다.");
        }
        deliveryMapper.deleteDelivery(id);
    }

    // ✅ 배송상태 수정
    @Transactional
    public void updateDeliveryStatus(Long orderItemId, String status) {
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("유효하지 않은 배송 상태입니다: " + status);
        }

        DeliveryDTO delivery = deliveryMapper.findByOrderItemId(orderItemId);

        if (delivery == null) {
            throw new IllegalArgumentException("주문 항목이 존재하지 않습니다.");
        }

        if (Objects.equals(delivery.getDeliveryStatus(), status)) {
            throw new IllegalArgumentException("이미 배송 상태가 " + status + "입니다.");
        }

        try {
            deliveryMapper.updateDeliveryStatus(orderItemId, status);
        } catch (Exception e) {
            throw new RuntimeException("배송 상태 업데이트 실패: " + e.getMessage());
        }
    }

    // ✅ 배송 상태가 유효한 상태인지 확인하는 메소드
    private boolean isValidStatus(String status) {
        return "배송준비중".equals(status) || "출고됨".equals(status) || "배송중".equals(status) || "배송완료".equals(status);
    }
}
