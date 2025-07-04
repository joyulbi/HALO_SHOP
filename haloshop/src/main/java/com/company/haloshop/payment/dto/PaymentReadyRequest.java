// PaymentReadyRequest.java
package com.company.haloshop.payment.dto;

import lombok.Data;

@Data
public class PaymentReadyRequest {
    private Long orderId;
    private int amount;
    private String used;
    private Long accountId;        // ✅ 추가
    private Long payAmount;
    private Long totalPrice;

}
