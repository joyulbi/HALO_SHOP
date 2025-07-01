// com.company.haloshop.dto.shop.Inventory.java

package com.company.haloshop.dto.shop;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Inventory {
    private Long id;
    private Long itemsId;
    private int stockVolume;      // 입고량
    private int inventoryVolume;  // 재고량
    private LocalDateTime createdAt;
}
