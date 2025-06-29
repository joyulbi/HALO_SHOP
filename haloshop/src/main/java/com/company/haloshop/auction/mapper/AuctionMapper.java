package com.company.haloshop.auction.mapper;

import com.company.haloshop.auction.dto.Auction;
import java.util.List;

public interface AuctionMapper {
    Auction selectById(Long id);
    List<Auction> selectAll();
    void insert(Auction auction);
    void update(Auction auction);
    void delete(Long id);
}
