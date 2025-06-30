package com.company.haloshop.items;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Items;
import com.company.haloshop.dto.shop.ItemsImage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemsService {

    private final ItemsMapper itemsMapper;
    private final ItemsImageMapper itemsImageMapper;

    // 🔥 상품 + 이미지 통합 등록 (itemId 반환)
    public Long insert(Items item, List<String> imageUrls) {
        // 1. 상품 저장
        itemsMapper.insert(item); // item.getId() 생성됨 (Mapper에서 useGeneratedKeys=true 세팅 가정)

        // 2. 이미지 저장
        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (String url : imageUrls) {
                ItemsImage image = new ItemsImage();
                image.setItemsId(item.getId()); // itemId 정상 세팅
                image.setUrl(url);
                itemsImageMapper.insert(image);
            }
        }

        return item.getId(); // 🔥 itemId 반환
    }

    // 🔥 전체 상품 조회
    public List<Items> findAll() {
        return itemsMapper.findAll();
    }

    // 🔥 개별 상품 조회
    public Items findById(Long id) {
        return itemsMapper.findById(id);
    }

    // 🔥 상품 수정
    public void update(Items item) {
        itemsMapper.update(item);
    }

    // 🔥 상품 삭제
    public void delete(Long id) {
        itemsMapper.delete(id);
    }

    // 🔥 상품별 이미지 조회
    public List<ItemsImage> findImagesByItemId(Long itemId) {
        return itemsImageMapper.findByItemsId(itemId);
    }
}
