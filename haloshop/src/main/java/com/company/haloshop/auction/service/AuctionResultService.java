package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionResult;
import com.company.haloshop.auction.mapper.AuctionResultMapper;
import org.springframework.stereotype.Service;

@Service
public class AuctionResultService {
    private final AuctionResultMapper auctionResultMapper;

    public AuctionResultService(AuctionResultMapper auctionResultMapper) {
        this.auctionResultMapper = auctionResultMapper;
    }

    public AuctionResult getByAuctionId(Long auctionId) {
        return auctionResultMapper.selectByAuctionId(auctionId);
    }

    public void create(AuctionResult auctionResult) {
        auctionResultMapper.insert(auctionResult);
    }

    public void update(AuctionResult auctionResult) {
        auctionResultMapper.update(auctionResult);
    }

    public void delete(Long auctionId) {
        auctionResultMapper.delete(auctionId);
    }
}
