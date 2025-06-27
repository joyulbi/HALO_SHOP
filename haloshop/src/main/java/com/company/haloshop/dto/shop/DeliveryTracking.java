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
public class DeliveryTracking {
    private Long id;
    private Long orderItemsId;
    private String status;
    private String trackingNumber;
    private String carrier;
    private LocalDateTime updatedAt;
}
