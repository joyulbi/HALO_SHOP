package com.company.haloshop.inventory;

import com.company.haloshop.dto.shop.Inventory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryMapper inventoryMapper;

    public void addInventory(Inventory inventory) {
        inventoryMapper.insertInventory(inventory);
    }

    public List<Inventory> getInventoryList() {
        return inventoryMapper.getInventoryList();
    }
    
    public void updateInventory(Inventory inventory) {
        inventoryMapper.updateInventory(inventory);
    }

    public void deleteInventory(Long id) {
        inventoryMapper.deleteInventory(id);
    }
}
