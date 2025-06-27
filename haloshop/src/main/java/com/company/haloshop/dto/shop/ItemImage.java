package com.company.haloshop.dto.shop;

import lombok.Data;

@Data
public class ItemImage {
    private Long id;        // PK
    private Long itemsId;   // FK: 상품 ID
    private String url;     // 이미지 경로
}
