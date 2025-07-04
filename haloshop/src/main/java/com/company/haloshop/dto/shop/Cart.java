package com.company.haloshop.dto.shop;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Cart {
    private Long id;           // cart id (PK)
    private Long accountId;    // 유저 id (FK)
    private Long itemsId;      // 상품 id (FK)
    private int quantity;      // 수량
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 🔥 여기 추가: 조회 전용 필드
    private String name;       // 상품명
    private int price;         // 상품 가격
    private String imageUrl;   // 상품 이미지 URL
}
