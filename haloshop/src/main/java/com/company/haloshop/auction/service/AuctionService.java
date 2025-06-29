package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.mapper.AuctionMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuctionService {
    private final AuctionMapper auctionMapper;

    public AuctionService(AuctionMapper auctionMapper) {
        this.auctionMapper = auctionMapper;
    }

    public Auction getById(Long id) {
        return auctionMapper.selectById(id);
    }

    public List<Auction> getAll() {
        return auctionMapper.selectAll();
    }

    public void create(Auction auction) {
        auctionMapper.insert(auction);
    }

    public void update(Auction auction) {
        auctionMapper.update(auction);
    }

    public void delete(Long id) {
        auctionMapper.delete(id);
    }
}
