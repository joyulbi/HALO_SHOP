package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.mapper.AuctionLogMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuctionLogService {
    private final AuctionLogMapper auctionLogMapper;

    public AuctionLogService(AuctionLogMapper auctionLogMapper) {
        this.auctionLogMapper = auctionLogMapper;
    }

    public AuctionLog getById(Long id) {
        return auctionLogMapper.selectById(id);
    }

    public List<AuctionLog> getByAuctionId(Long auctionId) {
        return auctionLogMapper.selectByAuctionId(auctionId);
    }

    public void create(AuctionLog auctionLog) {
        auctionLogMapper.insert(auctionLog);
    }

    public void delete(Long id) {
        auctionLogMapper.delete(id);
    }
}
