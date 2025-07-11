package com.company.haloshop.dto.shop;

import lombok.Data;

@Data
public class RecommendedItemDto {
    private Long id;
    private String name;
    private int price;
    private String imageUrl;
}
