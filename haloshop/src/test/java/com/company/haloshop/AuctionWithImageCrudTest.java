package com.company.haloshop;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.dto.AuctionImage;
import com.company.haloshop.auction.service.AuctionService;
import com.company.haloshop.auction.service.AuctionImageService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
//@Transactional
class AuctionWithImageCrudTest {

    @Autowired
    AuctionService auctionService;
    @Autowired
    AuctionImageService auctionImageService;

    static Long auctionId;
    static Long imageId;

    @Disabled @Test 
    void 경매_등록_및_이미지등록() {
        Auction auction = new Auction();
        auction.setTitle("이미지 포함 경매");
        auction.setDescription("JUnit 이미지 등록 테스트");
        auction.setStartPrice(1000);
        auction.setStartTime(LocalDateTime.now());
        auction.setEndTime(LocalDateTime.now().plusDays(2));
        auction.setStatus("READY");
        auction.setCreatedAt(LocalDateTime.now());
        auctionService.create(auction);

        auctionId = auctionService.getAll().get(auctionService.getAll().size() - 1).getId();

        AuctionImage image = new AuctionImage();
        image.setAuctionId(auctionId);
        image.setUrl("http://test.com/image1.jpg");
        auctionImageService.create(image);

        imageId = auctionImageService.getByAuctionId(auctionId).get(0).getId();

        Assertions.assertNotNull(auctionId);
        Assertions.assertNotNull(imageId);
        
        System.out.println("auctionId: " + auctionId);
        System.out.println("imageId: " + imageId);
    }

    @Disabled @Test
    void 경매_및_이미지_단건조회() {
    	auctionId = 1L;
        Auction auction = auctionService.getById(auctionId);
        Assertions.assertNotNull(auction);

        List<AuctionImage> images = auctionImageService.getByAuctionId(auctionId);
        Assertions.assertFalse(images.isEmpty());
        Assertions.assertEquals("http://test.com/image1.jpg", images.get(0).getUrl());
    }

    @Disabled @Test
    void 경매_및_이미지_수정() {
        Long auctionId = 1L;
        Auction auction = auctionService.getById(auctionId);
        auction.setTitle("수정된 경매");
        auction.setStartPrice(1000);
        auction.setStartTime(LocalDateTime.now());
        auction.setEndTime(LocalDateTime.now().plusDays(2));
        auction.setStatus("READY");
        auction.setCreatedAt(LocalDateTime.now());

        auctionService.update(auction);

        List<AuctionImage> images = auctionImageService.getByAuctionId(auctionId);
        Assertions.assertFalse(images.isEmpty());
        AuctionImage image = images.get(0); // 여기서 딸려오는 id!
        image.setUrl("http://test.com/changed.jpg");
        auctionImageService.update(image);
    }

    @Test
    void 경매_및_이미지_삭제() {
        Long auctionId = 1L; 
        List<AuctionImage> images = auctionImageService.getByAuctionId(auctionId);
        Assertions.assertFalse(images.isEmpty());
        AuctionImage image = images.get(0);

        auctionImageService.delete(image.getId());
        Assertions.assertNull(auctionImageService.getById(image.getId()));

        auctionService.delete(auctionId);
        Assertions.assertNull(auctionService.getById(auctionId));
    }
}
