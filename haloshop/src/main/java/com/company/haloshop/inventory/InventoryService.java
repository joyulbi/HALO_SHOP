package com.company.haloshop.inventory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryMapper inventoryMapper;

    public void addInventory(com.company.haloshop.dto.shop.Inventory inventory) {
        // 🔥 현재 총 재고량 조회
        int currentInventory = inventoryMapper.getCurrentInventoryVolume(inventory.getItemsId());

        // 🔥 현재 재고 + 이번 입고량 = 총 재고량
        inventory.setInventoryVolume(currentInventory + inventory.getStockVolume());

        inventoryMapper.insertInventory(inventory);
    }

    public List<Map<String, Object>> getInventoryList() {
        return inventoryMapper.getInventoryList();
    }

    public void updateInventory(com.company.haloshop.dto.shop.Inventory inventory) {
        // 🔥 기존 입고 내역 조회
        Map<String, Object> existingInventory = inventoryMapper.findInventoryById(inventory.getId());

        int oldStockVolume = (int) existingInventory.get("stock_volume");
        int oldInventoryVolume = (int) existingInventory.get("inventory_volume");

        // 🔥 총 재고량 계산: 기존 재고 - 기존 입고량 + 수정된 입고량
        int newInventoryVolume = oldInventoryVolume - oldStockVolume + inventory.getStockVolume();

        // 🔥 계산된 총 재고량 세팅
        inventory.setInventoryVolume(newInventoryVolume);

        // 🔥 업데이트
        inventoryMapper.updateInventory(inventory);
    }

    public void deleteInventory(Long id) {
        inventoryMapper.deleteInventory(id);
    }
}