package com.company.haloshop.inventory;

import com.company.haloshop.dto.shop.Inventory;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/inventory") // 관리자 전용 URL
public class InventoryController {

    private final InventoryService inventoryService;

    // 입고 등록
    @PostMapping
    public void addInventory(@RequestBody Inventory inventory) {
        inventoryService.addInventory(inventory);
    }

    // 입고 내역 조회
    @GetMapping
    public List<Inventory> getInventoryList() {
        return inventoryService.getInventoryList();
    }
    
    // 재고 수정
    @PutMapping("/{id}")
    public void updateInventory(@PathVariable Long id, @RequestBody Inventory inventory) {
        inventory.setId(id);
        inventoryService.updateInventory(inventory);
    }

    // 입고 삭제
    @DeleteMapping("/{id}")
    public void deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
    }
}
