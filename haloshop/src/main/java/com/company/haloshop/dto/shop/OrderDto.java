package com.company.haloshop.dto.shop;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDto {

    private Long id;
    private Long accountId;
    private Long deliveryId;
    private Long totalPrice;
    private String used;            // 결제 수단
    private String paymentStatus;   // PENDING, PAID, FAILED
    private String createdAt;       // ISO 문자열로 처리
    private String updatedAt;       // ISO 문자열로 처리
}
