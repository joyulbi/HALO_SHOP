package com.company.haloshop.auction.mapper;

import com.company.haloshop.auction.dto.AuctionImage;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuctionImageMapper {
    AuctionImage selectById(Long id);
    List<AuctionImage> selectByAuctionId(Long auctionId);
    void insert(AuctionImage auctionImage);
    void update(AuctionImage auctionImage);
    void delete(Long id);
    void deleteByAuctionId(Long auctionId);
}
