package com.company.haloshop.dto.shop;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DeliveryDTO {
    private Long id;
    private Long accountId;
    private String address;
    private String addressDetail;
    private Integer zipcode;
    private String recipientName;

    private String productName;
    private String imageUrl;
    private String deliveryStatus;

    // 🔥 관리자용 추가 필드
    private Long orderItemId;
    private String trackingNumber;
    private String carrier;
    private LocalDateTime updatedAt;
}
