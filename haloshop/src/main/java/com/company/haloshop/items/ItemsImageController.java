package com.company.haloshop.items;

import com.company.haloshop.dto.shop.ItemsImage;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/item-images")
public class ItemsImageController {

    private final ItemsImageService itemsImageService;

    // 이미지 등록
    @PostMapping
    public void insert(@RequestBody ItemsImage itemImage) {
        itemsImageService.insert(itemImage);
    }

    // 상품별 이미지 조회 (유저, 관리자 모두 사용 가능)
    @GetMapping("/{itemsId}")
    public List<ItemsImage> findByItemsId(@PathVariable Long itemsId) {
        return itemsImageService.findByItemsId(itemsId);
    }

    // 개별 이미지 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        itemsImageService.delete(id);
    }

    // 상품 삭제 시 이미지 일괄 삭제
    @DeleteMapping("/all/{itemsId}")
    public void deleteByItemsId(@PathVariable Long itemsId) {
        itemsImageService.deleteByItemsId(itemsId);
    }
}
