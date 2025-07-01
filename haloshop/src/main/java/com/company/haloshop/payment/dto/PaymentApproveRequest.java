// PaymentApproveRequest.java
package com.company.haloshop.payment.dto;

import lombok.Data;

@Data
public class PaymentApproveRequest {
	private String tempOrderId;
	private Integer usedPoint;
	private Long totalPrice;
	private Long payAmount;
	private Long accountId;
	private String tid;
	private String pgToken;

}