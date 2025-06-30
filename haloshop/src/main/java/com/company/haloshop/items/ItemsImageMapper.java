package com.company.haloshop.items;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.ItemsImage;

import java.util.List;

@Mapper
public interface ItemsImageMapper {

    void insert(ItemsImage itemsImage);

    List<ItemsImage> findByItemsId(Long itemsId);

    void delete(Long id);

    void deleteByItemsId(Long itemsId); // 상품 삭제 시 이미지 일괄 삭제
}
