package com.company.haloshop.dto.shop;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//@Builder
public class OrderDto {

    private Long id;
    private Long accountId;
    private Long deliveryId;
    private Long totalPrice;
    private String used;            // 결제 수단
    private String paymentStatus;   // PENDING, PAID, FAILED
    private Integer amount;         // ✅ 포인트 사용 금액 추가
    private String tid;             // ✅ 카카오페이 거래 고유 번호 추가
    private Long payAmount;

    private LocalDateTime  createdAt;       // ISO 문자열로 처리
    private LocalDateTime  updatedAt;       // ISO 문자열로 처리
}
