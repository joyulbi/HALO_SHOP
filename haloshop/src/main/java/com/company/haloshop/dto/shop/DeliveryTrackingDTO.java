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
public class DeliveryTrackingDTO {
    private Long id;
    private Long orderItemsId;
    private String status;  // enum : 배송준비중, 출고됨, 배송중, 배송완료
    private String trackingNumber;
    private String carrier;
    private LocalDateTime updatedAt;
}
