package com.company.haloshop.inventory;

import com.company.haloshop.dto.shop.Inventory;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface InventoryMapper {
    void insertInventory(Inventory inventory);
    List<Inventory> getInventoryList();
    void updateInventory(Inventory inventory);
    void deleteInventory(Long id); 
}
