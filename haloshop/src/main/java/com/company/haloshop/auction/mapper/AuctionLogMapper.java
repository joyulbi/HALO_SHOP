package com.company.haloshop.auction.mapper;

import com.company.haloshop.auction.dto.AuctionLog;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuctionLogMapper {
    AuctionLog selectById(Long id);
    List<AuctionLog> selectByAuctionId(Long auctionId);
    void insert(AuctionLog auctionLog);
    void delete(Long id);
}
