package com.company.haloshop.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPointDto {
    private Long id;
    private Long accountId;
    private Long totalPayment;
    private Long totalPoint;
    private String grade;
    private LocalDateTime updatedAt;
}
