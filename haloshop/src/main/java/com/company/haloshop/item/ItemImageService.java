package com.company.haloshop.item;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.ItemImage;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemImageService {

    private final ItemImageMapper itemImageMapper;

    public void insert(ItemImage itemImage) {
        itemImageMapper.insert(itemImage);
    }

    public List<ItemImage> findByItemsId(Long itemsId) {
        return itemImageMapper.findByItemsId(itemsId);
    }

    public void delete(Long id) {
        itemImageMapper.delete(id);
    }

    public void deleteByItemsId(Long itemsId) {
        itemImageMapper.deleteByItemsId(itemsId);
    }
}
