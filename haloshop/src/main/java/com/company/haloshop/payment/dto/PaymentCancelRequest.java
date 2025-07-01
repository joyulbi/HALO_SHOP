// PaymentCancelRequest.java
package com.company.haloshop.payment.dto;

import lombok.Data;

@Data
public class PaymentCancelRequest {
    private Long orderId;
    private String reason;
    private String tid;
}