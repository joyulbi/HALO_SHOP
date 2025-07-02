package com.company.haloshop.category;

import com.company.haloshop.dto.shop.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 🔥 JSON 응답
    @GetMapping
    public List<Category> list() {
        return categoryService.findAll();
    }
}
