package com.company.haloshop.dto.shop;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PointLogDto {
    private Long id;
    private Long accountId;
    private String type;
    private Integer amount;
    private LocalDateTime createdAt;
}
