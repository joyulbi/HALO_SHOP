package com.company.haloshop.auction.mapper;

import com.company.haloshop.auction.dto.AuctionResult;

public interface AuctionResultMapper {
    AuctionResult selectByAuctionId(Long auctionId);
    void insert(AuctionResult auctionResult);
    void update(AuctionResult auctionResult);
    void delete(Long auctionId);
}
