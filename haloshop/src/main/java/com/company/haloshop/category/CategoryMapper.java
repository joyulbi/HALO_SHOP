package com.company.haloshop.category;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.company.haloshop.dto.shop.Category; // ✅ DTO로 import

@Mapper
public interface CategoryMapper {
	
	void insert(Category category);

    // 카테고리 목록 조회
    List<Category> findAll();
}
