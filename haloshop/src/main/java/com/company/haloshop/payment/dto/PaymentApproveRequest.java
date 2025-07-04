// PaymentApproveRequest.java
package com.company.haloshop.payment.dto;

import lombok.Data;

@Data
public class PaymentApproveRequest {
    private Long accountId;   // ✅ 어떤 유저의 결제인지
    private String pgToken;   // ✅ 카카오에서 redirect 시 전달해주는 pg_token
}
