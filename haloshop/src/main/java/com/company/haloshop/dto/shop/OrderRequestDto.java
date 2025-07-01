package com.company.haloshop.dto.shop;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDto {
	private Long id;
    private Long accountId;
    private Long deliveryId;
    private Long totalPrice;
    private String used;            // 결제 수단
    private String paymentStatus;   // PENDING, PAID, FAILED
    private Integer amount;
    private Long payAmount;
    private List<OrderItemDto> orderItems; // 주문 아이템 리스트
}
