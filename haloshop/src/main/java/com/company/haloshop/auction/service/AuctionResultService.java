package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionResult;
import com.company.haloshop.auction.mapper.AuctionResultMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuctionResultService {

    private final AuctionResultMapper auctionResultMapper;

    // 낙찰 결과 단건 조회
    public AuctionResult getByAuctionId(Long auctionId) {
        return auctionResultMapper.selectByAuctionId(auctionId);
    }

    // 낙찰 결과 등록
    public void create(AuctionResult auctionResult) {
        auctionResultMapper.insert(auctionResult);
    }

    // 낙찰 결과 수정
    public void update(AuctionResult auctionResult) {
        auctionResultMapper.update(auctionResult);
    }

    // 낙찰 결과 삭제
    public void delete(Long auctionId) {
        auctionResultMapper.delete(auctionId);
    }
}
