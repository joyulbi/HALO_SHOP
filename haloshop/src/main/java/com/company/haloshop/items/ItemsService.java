package com.company.haloshop.items;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.company.haloshop.dto.shop.Items;
import com.company.haloshop.dto.shop.ItemsImage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemsService {

    private final ItemsMapper itemsMapper;
    private final ItemsImageMapper itemsImageMapper;

    // 🔥 상품 + 이미지 통합 등록
    public Long insert(Items item, List<String> imageUrls) {
        itemsMapper.insert(item);

        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (String url : imageUrls) {
                ItemsImage image = new ItemsImage();
                image.setItemsId(item.getId());
                image.setUrl(url);
                itemsImageMapper.insert(image);
            }
        }

        return item.getId();
    }

    // 🔥 전체 상품 조회
    public List<Items> findAll() {
        return itemsMapper.findAll();
    }

    // 🔥 개별 상품 조회
    public Items findById(Long id) {
        return itemsMapper.findById(id);
    }

    // 🔥 상품 수정 + 이미지 저장
    public void update(Items item, MultipartFile image) {
        itemsMapper.update(item);

        if (image != null && !image.isEmpty()) {
            itemsImageMapper.deleteByItemsId(item.getId());

            String uuid = UUID.randomUUID().toString();
            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = uuid + extension;

            String savePath = "C:/upload/" + fileName;
            File file = new File(savePath);

            try {
                image.transferTo(file);
            } catch (IOException e) {
                e.printStackTrace();
            }

            ItemsImage newImage = new ItemsImage();
            newImage.setItemsId(item.getId());
            newImage.setUrl("/images/" + fileName);
            itemsImageMapper.insert(newImage);
        }
    }

    // 🔥 상품 삭제 + 이미지 파일도 삭제
    public void delete(Long id) {
        List<ItemsImage> images = itemsImageMapper.findByItemsId(id);
        itemsImageMapper.deleteByItemsId(id);
        itemsMapper.delete(id);
        

        for (ItemsImage image : images) {
            String fileName = image.getUrl().replace("/images/", "");
            File file = new File("C:/upload/" + fileName);
            if (file.exists()) {
                file.delete();
            }
        }
    }

    // 🔥 상품별 이미지 조회
    public List<ItemsImage> findImagesByItemId(Long itemId) {
        return itemsImageMapper.findByItemsId(itemId);
    }

    // 🔥 상품별 재고 조회 (inventory_volume 합계)
    public int findInventoryByItemId(Long itemId) {
        int result = itemsMapper.getTotalInventoryByItemId(itemId);
        System.out.println("🔥 itemId = " + itemId + " → 재고량 = " + result);
        return result;
    }
}
