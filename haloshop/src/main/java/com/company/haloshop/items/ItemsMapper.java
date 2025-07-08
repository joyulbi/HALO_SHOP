package com.company.haloshop.items;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.Items;

import java.util.List;

@Mapper
public interface ItemsMapper {

    void insert(Items item);

    List<Items> findAll();

    Items findById(Long id);

    void update(Items item);

    void delete(Long id);
    
    int getTotalInventoryByItemId(Long itemId);
}
