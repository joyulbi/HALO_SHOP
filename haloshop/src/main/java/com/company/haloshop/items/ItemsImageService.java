package com.company.haloshop.items;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.ItemsImage;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemsImageService {

    private final ItemsImageMapper itemsImageMapper;

    public void insert(ItemsImage itemImage) {
        itemsImageMapper.insert(itemImage);
    }

    public List<ItemsImage> findByItemsId(Long itemsId) {
        return itemsImageMapper.findByItemsId(itemsId);
    }

    public void delete(Long id) {
        itemsImageMapper.delete(id);
    }

    public void deleteByItemsId(Long itemsId) {
        itemsImageMapper.deleteByItemsId(itemsId);
    }
}
