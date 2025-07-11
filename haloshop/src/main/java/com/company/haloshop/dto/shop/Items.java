package com.company.haloshop.dto.shop;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Items {
    private Long id;
    private String name;
    private String description;
    private int price;
    private Long teamId;      // 팀 테이블 FK
    private Long categoryId;  // 카테고리 테이블 FK
    private LocalDateTime createdAt;
    private String imageUrl;
}
