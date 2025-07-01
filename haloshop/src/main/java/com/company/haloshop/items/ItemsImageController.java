package com.company.haloshop.items;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.company.haloshop.dto.shop.ItemsImage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/item-images")
public class ItemsImageController {

    private final ItemsImageService itemsImageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "C:/upload";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 🔥 파일명 강제 영문화 (확장자 유지)
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + fileExtension;

            Path path = Paths.get(uploadDir, fileName);
            Files.write(path, file.getBytes());

            String imageUrl = "/images/" + fileName;

            return ResponseEntity.ok(imageUrl);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 업로드 실패");
        }
    }

    // 이미지 등록
    @PostMapping
    public void insertImages(@RequestBody List<ItemsImage> itemImages) {
        for (ItemsImage itemImage : itemImages) {
            itemsImageService.insert(itemImage);
        }
    }

    // 상품별 이미지 조회
    @GetMapping("/{itemsId}")
    public List<ItemsImage> findByItemsId(@PathVariable Long itemsId) {
        return itemsImageService.findByItemsId(itemsId);
    }

    // 개별 이미지 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        itemsImageService.delete(id);
    }

    // 상품 삭제 시 이미지 일괄 삭제
    @DeleteMapping("/all/{itemsId}")
    public void deleteByItemsId(@PathVariable Long itemsId) {
        itemsImageService.deleteByItemsId(itemsId);
    }
}
