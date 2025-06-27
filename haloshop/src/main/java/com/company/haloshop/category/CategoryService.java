package com.company.haloshop.category;

import java.util.List;
import java.util.Locale.Category;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    // 카테고리 목록 조회 (조회만 필요)
    public List<Category> findAll() {
        return categoryMapper.findAll();
    }
}
