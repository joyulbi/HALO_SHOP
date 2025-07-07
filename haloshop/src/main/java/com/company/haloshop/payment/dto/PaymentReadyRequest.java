// PaymentReadyRequest.java
package com.company.haloshop.payment.dto;

import java.util.List;

import com.company.haloshop.dto.shop.OrderItemDto;

import lombok.Data;

@Data
public class PaymentReadyRequest {
    private Long orderId;
    private int amount;
    private String used;
    private Long accountId;        // ✅ 추가
    private Long payAmount;
    private Long totalPrice;
    private List<OrderItemDto> orderItems;

}