package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionImage;
import com.company.haloshop.auction.service.AuctionImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auction-images")
@RequiredArgsConstructor
public class AuctionImageController {

    private final AuctionImageService auctionImageService;

    // 경매 이미지 단건 조회
    @GetMapping("/{id}")
    public AuctionImage getById(@PathVariable Long id) {
        return auctionImageService.getById(id);
    }

    // 특정 경매의 이미지 목록 조회
    @GetMapping("/auction/{auctionId}")
    public List<AuctionImage> getByAuctionId(@PathVariable Long auctionId) {
        return auctionImageService.getByAuctionId(auctionId);
    }

    // 이미지 등록
    @PostMapping
    public void create(@RequestBody AuctionImage auctionImage) {
        auctionImageService.create(auctionImage);
    }

    // 이미지 수정
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
}
