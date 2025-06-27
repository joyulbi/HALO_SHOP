package com.company.haloshop.category;

import java.util.List;
import java.util.Locale.Category;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper {

    // 카테고리 목록 조회
    List<Category> findAll();
}
