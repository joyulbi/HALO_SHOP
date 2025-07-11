package com.company.haloshop.items;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.shop.Items;

@Mapper
public interface ItemsMapper {

    void insert(Items item);

    List<Items> findAll();

    Items findById(Long id);

    void update(Items item);

    void delete(Long id);

    int getTotalInventoryByItemId(Long itemId);

    List<Items> findByNames(@Param("names") List<String> names);
    
    List<Items> findByCategoryId(@Param("categoryId") Long categoryId);
}
