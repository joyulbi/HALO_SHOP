package com.company.haloshop.dto.shop;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDto {

    private Long id;
    private Long ordersId;
    private Long itemId;
    private String itemName;
    private Integer productPrice;
    private Integer quantity;
    private String imageUrl;
}
