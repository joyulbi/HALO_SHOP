package com.company.haloshop.item;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Item;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemMapper itemMapper;

    public void insert(Item item) {
        itemMapper.insert(item);
    }

    public List<Item> findAll() {
        return itemMapper.findAll();
    }

    public Item findById(Long id) {
        return itemMapper.findById(id);
    }

    public void update(Item item) {
        itemMapper.update(item);
    }

    public void delete(Long id) {
        itemMapper.delete(id);
    }
}
