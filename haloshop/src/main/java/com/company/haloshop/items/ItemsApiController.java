package com.company.haloshop.items;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.company.haloshop.dto.shop.Items;
import com.company.haloshop.dto.shop.ItemsImage;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
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
            
            
            int inventory = itemsService.findInventoryByItemId(item.getId());
            itemMap.put("inventory_volume", inventory);

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
        
        int inventory = itemsService.findInventoryByItemId(item.getId());
        itemMap.put("inventory_volume", inventory);

        return itemMap;
    }

    // 🔥 상품 등록 (변경 ❌ - 그대로 사용)
    @PostMapping("/admin")
    public ResponseEntity<Long> addItem(@RequestBody Map<String, Object> request) {
        Map<String, Object> itemMap = (Map<String, Object>) request.get("item");
        List<String> imageUrls = (List<String>) request.get("imageUrls");

        Items item = new Items();
        item.setName((String) itemMap.get("name"));
        item.setDescription((String) itemMap.get("description"));
        item.setPrice((Integer) itemMap.get("price"));
        item.setTeamId(Long.valueOf(itemMap.get("teamId").toString()));
        item.setCategoryId(Long.valueOf(itemMap.get("categoryId").toString()));

        Long itemId = itemsService.insert(item, imageUrls);

        return ResponseEntity.ok(itemId);
    }

    // 🔥 상품 수정 (multipart/form-data 전용)
    @PutMapping("/admin/{id}")
    public ResponseEntity<String> updateItem(@PathVariable Long id,
                                             @RequestPart("item") Items item,
                                             @RequestPart(value = "image", required = false) MultipartFile image) {

        item.setId(id); // path에서 받은 id를 item에 세팅

        itemsService.update(item, image);

        return ResponseEntity.ok("상품이 수정되었습니다.");
    }

    // 🔥 상품 삭제
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        itemsService.delete(id);
        return ResponseEntity.ok("상품이 삭제되었습니다.");
    }
}