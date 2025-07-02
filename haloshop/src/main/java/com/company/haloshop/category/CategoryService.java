package com.company.haloshop.category;

import java.util.List;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Category;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    // ✅ 서버 시작 시 카테고리 자동 삽입
    @EventListener(ApplicationReadyEvent.class)
    public void insertInitialCategories() {
        List<Category> categories = categoryMapper.findAll();
        if (categories == null || categories.isEmpty()) {
            Category[] initialCategories = new Category[] {
                createCategory("유니폼"),
                createCategory("모자"),
                createCategory("휴대폰 케이스"),
                createCategory("야구용품"),
                createCategory("응원/굿즈"),
                createCategory("기타")
            };

            for (Category category : initialCategories) {
                categoryMapper.insert(category);
            }
        }
    }

    // ✅ 카테고리 목록 조회
    public List<Category> findAll() {
        return categoryMapper.findAll();
    }

    // 🔥 카테고리 객체 생성
    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return category;
    }
}
