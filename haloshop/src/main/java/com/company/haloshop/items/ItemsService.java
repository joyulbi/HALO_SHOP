package com.company.haloshop.items;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Items;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemsService {

    private final ItemsMapper itemsMapper;

    public void insert(Items item) {
        itemsMapper.insert(item);
    }

    public List<Items> findAll() {
        return itemsMapper.findAll();
    }

    public Items findById(Long id) {
        return itemsMapper.findById(id);
    }

    public void update(Items item) {
        itemsMapper.update(item);
    }

    public void delete(Long id) {
        itemsMapper.delete(id);
    }
}
