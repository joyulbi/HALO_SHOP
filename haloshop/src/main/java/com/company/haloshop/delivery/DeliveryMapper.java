package com.company.haloshop.delivery;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.shop.DeliveryDTO;

@Mapper
public interface DeliveryMapper {

    // ✅ 배송 등록
    void insertDelivery(DeliveryDTO delivery);

    // ✅ 사용자별 배송 목록 조회
    List<DeliveryDTO> findByAccountId(@Param("accountId") Long accountId);

    // ✅ 관리자 전체 배송 목록 조회 (주문 정보 포함)
    List<DeliveryDTO> findAllDeliveriesWithOrderInfo();

    // ✅ 전체 배송 목록 조회 (상품 정보 포함)
    List<DeliveryDTO> findAll();

    // ✅ 단일 배송 조회 (필요할 경우 사용)
    DeliveryDTO findById(@Param("id") Long id);

    // ✅ 배송 수정 (주소, 연락처 등)
    void updateDelivery(DeliveryDTO delivery);

    // ✅ 배송 삭제 (관리자용)
    void deleteDelivery(@Param("id") Long id);

    // ✅ 배송 상태 수정 (관리자용)
    void updateDeliveryStatus(@Param("orderItemId") Long orderItemId, @Param("status") String status);

    // ✅ 주문 항목 ID로 배송 추적 조회
    DeliveryDTO findByOrderItemId(@Param("orderItemId") Long orderItemId);

    // ✅ 기본 배송지 등록 (회원가입 시)
    void insertDefaultDeliveryAddress(DeliveryDTO deliveryDTO);

    // ✅ 기본 배송지 조회 (상품 추가 시)
    DeliveryDTO findDefaultDeliveryByAccountId(@Param("accountId") Long accountId);

    // ✅ 기존 기본 배송지 업데이트 (기본 배송지가 이미 있으면 업데이트)
    void updateDefaultDeliveryAddress(DeliveryDTO deliveryDTO);

    // ✅ 기존 기본 배송지 삭제 (기존 기본 배송지를 삭제하고 새로 추가)
    void deleteDefaultDeliveryAddress(@Param("accountId") Long accountId);

    // ✅ 기존 기본 배송지 삭제 (기존 기본 배송지를 삭제)
    void removeExistsingDefaultDelivery(@Param("accountId") Long accountId);
}
