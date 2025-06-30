package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.mapper.AuctionLogMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionLogService {

    private final AuctionLogMapper auctionLogMapper;

    // 입찰 로그 단건 조회
    public AuctionLog getById(Long id) {
        return auctionLogMapper.selectById(id);
    }

    // 특정 경매의 입찰 로그 목록 조회
    public List<AuctionLog> getByAuctionId(Long auctionId) {
        return auctionLogMapper.selectByAuctionId(auctionId);
    }

    // 입찰 로그 등록
    public void create(AuctionLog auctionLog) {
        auctionLogMapper.insert(auctionLog);
    }

    // 입찰 로그 삭제
    public void delete(Long id) {
        auctionLogMapper.delete(id);
    }
}
