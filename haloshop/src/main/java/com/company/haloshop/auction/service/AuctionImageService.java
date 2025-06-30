package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionImage;
import com.company.haloshop.auction.mapper.AuctionImageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionImageService {

    private final AuctionImageMapper auctionImageMapper;

    // 경매 이미지 단건 조회
    public AuctionImage getById(Long id) {
        return auctionImageMapper.selectById(id);
    }

    // 특정 경매의 이미지 목록 조회
    public List<AuctionImage> getByAuctionId(Long auctionId) {
        return auctionImageMapper.selectByAuctionId(auctionId);
    }

    // 이미지 등록
    public void create(AuctionImage auctionImage) {
        auctionImageMapper.insert(auctionImage);
    }

    // 이미지 수정
    public void update(AuctionImage auctionImage) {
        auctionImageMapper.update(auctionImage);
    }

    // 이미지 삭제
    public void delete(Long id) {
        auctionImageMapper.delete(id);
    }
}
