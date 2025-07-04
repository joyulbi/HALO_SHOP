package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionImage;
import com.company.haloshop.auction.service.AuctionImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auction-images")
@RequiredArgsConstructor
public class AuctionImageController {

    private final AuctionImageService auctionImageService;

    // 이미지 단건 조회
    @GetMapping("/{id}")
    public AuctionImage getById(@PathVariable Long id) {
        return auctionImageService.getById(id);
    }

    // 특정 경매의 이미지 목록 조회
    @GetMapping("/auction/{auctionId}")
    public List<AuctionImage> getByAuctionId(@PathVariable Long auctionId) {
        return auctionImageService.getByAuctionId(auctionId);
    }

    // 이미지 정보 수정 (실제 파일 자체 수정은 지원X, url값 변경 등)
    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody AuctionImage auctionImage) {
        auctionImage.setId(id);
        auctionImageService.update(auctionImage);
    }

    // 이미지 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        auctionImageService.delete(id);
    }

    // 다중 파일 업로드(등록) API
    // FormData: auctionId, files[] (배열)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImages(
            @RequestParam("auctionId") Long auctionId,
            @RequestParam("files") List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 첨부되지 않았습니다.");
        }
        List<String> urls = auctionImageService.saveAuctionImages(auctionId, files);
        return ResponseEntity.ok(Map.of("urls", urls));
    }
}
