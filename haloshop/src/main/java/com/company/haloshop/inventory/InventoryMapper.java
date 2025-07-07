package com.company.haloshop.inventory;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.company.haloshop.dto.shop.Inventory;

@Mapper
public interface InventoryMapper {
    // 입고 등록
    void insertInventory(Inventory inventory);

    // 입고 내역 조회 (상품명 포함)
    List<Map<String, Object>> getInventoryList();

    // 현재 총 재고량 조회
    int getCurrentInventoryVolume(Long itemsId);

    // 입고 내역 수정
    void updateInventory(Inventory inventory);

    // 입고 내역 삭제
    void deleteInventory(Long id);

    // 🔥 입고 내역 단건 조회 (수정 시 사용)
    Map<String, Object> findInventoryById(Long id);
    
 // 재고 차감
    void decreaseInventoryVolume(@Param("itemsId") Long itemsId, @Param("quantity") int quantity);
}