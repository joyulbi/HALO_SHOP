package com.company.haloshop.items;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.company.haloshop.dto.shop.Items;
import com.company.haloshop.dto.shop.ItemsImage;

import java.util.*;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemsApiController {

    private final ItemsService itemsService;

    // 🔥 전체 상품 목록 (이미지 포함)
    @GetMapping
    public List<Map<String, Object>> getItemList() {
        List<Items> items = itemsService.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Items item : items) {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("id", item.getId());
            itemMap.put("name", item.getName());
            itemMap.put("description", item.getDescription());
            itemMap.put("price", item.getPrice());
            itemMap.put("teamId", item.getTeamId());
            itemMap.put("categoryId", item.getCategoryId());
            itemMap.put("createdAt", item.getCreatedAt());

            List<ItemsImage> images = itemsService.findImagesByItemId(item.getId());
            itemMap.put("images", images);

            result.add(itemMap);
        }

        return result;
    }

    // 🔥 개별 상품 조회 (이미지 포함)
    @GetMapping("/{id}")
    public Map<String, Object> getItemDetail(@PathVariable Long id) {
        Items item = itemsService.findById(id);
        Map<String, Object> itemMap = new HashMap<>();

        itemMap.put("id", item.getId());
        itemMap.put("name", item.getName());
        itemMap.put("description", item.getDescription());
        itemMap.put("price", item.getPrice());
        itemMap.put("teamId", item.getTeamId());
        itemMap.put("categoryId", item.getCategoryId());
        itemMap.put("createdAt", item.getCreatedAt());

        List<ItemsImage> images = itemsService.findImagesByItemId(item.getId());
        itemMap.put("images", images);

        return itemMap;
    }

    // 🔥 상품 등록 (관리자 전용 화면에서 호출)
    @PostMapping("/admin")
    public ResponseEntity<Long> addItem(@RequestBody Map<String, Object> request) {
        // 🔥 파라미터 파싱
        Map<String, Object> itemMap = (Map<String, Object>) request.get("item");
        List<String> imageUrls = (List<String>) request.get("imageUrls");

        Items item = new Items();
        item.setName((String) itemMap.get("name"));
        item.setDescription((String) itemMap.get("description"));
        item.setPrice((Integer) itemMap.get("price"));
        item.setTeamId(Long.valueOf(itemMap.get("teamId").toString()));
        item.setCategoryId(Long.valueOf(itemMap.get("categoryId").toString()));

        // 🔥 서비스에서 itemId 리턴 받기
        Long itemId = itemsService.insert(item, imageUrls);

        // 🔥 프론트에 itemId 리턴
        return ResponseEntity.ok(itemId);
    }

    // 🔥 상품 수정
    @PutMapping("/admin/{id}")
    public ResponseEntity<String> updateItem(@PathVariable Long id, @RequestBody Items item) {
        item.setId(id);
        itemsService.update(item);
        return ResponseEntity.ok("상품이 수정되었습니다.");
    }

    // 🔥 상품 삭제
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        itemsService.delete(id);
        return ResponseEntity.ok("상품이 삭제되었습니다.");
    }
}
