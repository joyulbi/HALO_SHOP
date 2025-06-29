package com.company.haloshop.auction.mapper;

import com.company.haloshop.auction.dto.AuctionImage;
import java.util.List;

public interface AuctionImageMapper {
    AuctionImage selectById(Long id);
    List<AuctionImage> selectByAuctionId(Long auctionId);
    void insert(AuctionImage auctionImage);
    void update(AuctionImage auctionImage);
    void delete(Long id);
}
