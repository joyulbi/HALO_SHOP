package com.company.haloshop.auction.mapper;

import com.company.haloshop.auction.dto.AuctionLog;
import java.util.List;

public interface AuctionLogMapper {
    AuctionLog selectById(Long id);
    List<AuctionLog> selectByAuctionId(Long auctionId);
    void insert(AuctionLog auctionLog);
    void delete(Long id);
}
