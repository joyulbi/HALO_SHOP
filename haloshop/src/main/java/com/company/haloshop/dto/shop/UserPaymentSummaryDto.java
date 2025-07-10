package com.company.haloshop.dto.shop;

import lombok.Data;

@Data
public class UserPaymentSummaryDto {
    private Long accountId;
    private Long totalPayment;
}
