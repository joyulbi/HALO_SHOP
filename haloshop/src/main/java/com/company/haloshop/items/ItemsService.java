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

    // 🔥 상품 + 이미지 통합 등록 (itemId 반환)
    public Long insert(Items item, List<String> imageUrls) {
        // 1. 상품 저장
        itemsMapper.insert(item);

        // 2. 이미지 저장
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

    // 🔥 상품 수정 + 이미지 수정 (파일 저장 포함)
    public void update(Items item, MultipartFile image) {
        // 1. 상품 정보 수정
        itemsMapper.update(item);

        // 2. 이미지 수정
        if (image != null && !image.isEmpty()) {
            // 기존 이미지 삭제
            itemsImageMapper.deleteByItemsId(item.getId());

            // 🔥 UUID 파일명 생성
            String uuid = UUID.randomUUID().toString();
            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = uuid + extension;

            // 🔥 실제 파일 저장 경로
            String savePath = "C:/upload/" + fileName;
            File file = new File(savePath);

            try {
                image.transferTo(file); // 🔥 실제 파일 저장
            } catch (IOException e) {
                e.printStackTrace();
            }

            // 🔥 DB 저장 경로
            ItemsImage newImage = new ItemsImage();
            newImage.setItemsId(item.getId());
            newImage.setUrl("/images/" + fileName);
            itemsImageMapper.insert(newImage);
        }
    }

    // 🔥 상품 삭제
    public void delete(Long id) {
        // 1. 상품 이미지 리스트 조회
        List<ItemsImage> images = itemsImageMapper.findByItemsId(id);

        // 2. DB에서 상품 삭제
        itemsMapper.delete(id);

        // 3. DB에서 이미지 삭제
        itemsImageMapper.deleteByItemsId(id);

        // 4. 실제 파일 삭제
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
}
