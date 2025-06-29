package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionImage;
import com.company.haloshop.auction.mapper.AuctionImageMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuctionImageService {
    private final AuctionImageMapper auctionImageMapper;

    public AuctionImageService(AuctionImageMapper auctionImageMapper) {
        this.auctionImageMapper = auctionImageMapper;
    }

    public AuctionImage getById(Long id) {
        return auctionImageMapper.selectById(id);
    }

    public List<AuctionImage> getByAuctionId(Long auctionId) {
        return auctionImageMapper.selectByAuctionId(auctionId);
    }

    public void create(AuctionImage auctionImage) {
        auctionImageMapper.insert(auctionImage);
    }

    public void update(AuctionImage auctionImage) {
        auctionImageMapper.update(auctionImage);
    }

    public void delete(Long id) {
        auctionImageMapper.delete(id);
    }
}
