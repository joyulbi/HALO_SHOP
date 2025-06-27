package com.company.haloshop.item;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.Item;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemApiController {

    private final ItemService itemService;

    // 상품 목록 (React 연동)
    @GetMapping
    public List<Item> itemList() {
        return itemService.findAll();
    }

    // 상품 상세 (React 연동)
    @GetMapping("/{id}")
    public Item itemDetail(@PathVariable Long id) {
        return itemService.findById(id);
    }
}
