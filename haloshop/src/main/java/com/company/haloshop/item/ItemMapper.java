package com.company.haloshop.item;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.Item;

import java.util.List;

@Mapper
public interface ItemMapper {

    void insert(Item item);

    List<Item> findAll();

    Item findById(Long id);

    void update(Item item);

    void delete(Long id);
}
