package com.company.haloshop.auction.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.auction.dto.AuctionResult;

@Mapper
public interface AuctionResultMapper {
    AuctionResult selectByAuctionId(Long auctionId);
    void insert(AuctionResult auctionResult);
    void update(AuctionResult auctionResult);
    void delete(Long auctionId);
    List<AuctionResult> selectByAccountId(@Param("accountId") Long accountId);
}
