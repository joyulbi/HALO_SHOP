package com.company.haloshop.items;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.Items;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemsApiController {

    private final ItemsService itemsService;

    // 상품 목록 (React 연동)
    @GetMapping
    public List<Items> itemList() {
        return itemsService.findAll();
    }

    // 상품 상세 (React 연동)
    @GetMapping("/{id}")
    public Items itemDetail(@PathVariable Long id) {
        return itemsService.findById(id);
    }
}
