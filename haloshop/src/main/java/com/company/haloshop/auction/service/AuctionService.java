package com.company.haloshop.auction.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.mapper.AuctionImageMapper;
import com.company.haloshop.auction.mapper.AuctionLogMapper;
import com.company.haloshop.auction.mapper.AuctionMapper;
import com.company.haloshop.auction.mapper.AuctionResultMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionMapper auctionMapper;
    private final AuctionLogMapper auctionLogMapper;
    private final AuctionImageMapper auctionImageMapper;
    private final AuctionResultMapper auctionResultMapper;

    // 경매 단건 조회
    public Auction getById(Long id) {
        return auctionMapper.selectById(id);
    }

    // 전체 경매 목록 조회
    public List<Auction> getAll() {
        return auctionMapper.selectAll();
    }

    // 경매 등록
    public void create(Auction auction) {
        auctionMapper.insert(auction);
    }

    // 경매 수정
    public void update(Auction auction) {
        auctionMapper.update(auction);
    }

    // 경매 삭제
    @Transactional
    public void delete(Long auctionId) {
    	auctionResultMapper.delete(auctionId);
    	auctionImageMapper.deleteByAuctionId(auctionId);
        auctionLogMapper.deleteByAuctionId(auctionId);
        auctionMapper.delete(auctionId);
    }
    
    // [스케줄러] 시작 시간 도달한 경매 → ONGOING
    public void updateToOngoingIfNeeded() {
        auctionMapper.updateStatusToOngoingIfStartTimePassed();
    }

    // [스케줄러] 종료 시간 도달한 경매 → FINISHED
    public void updateToFinishedIfNeeded() {
        auctionMapper.updateStatusToFinishedIfEndTimePassed();
    }

    // [타이머] 단일 경매 종료 처리 (WebSocket용)
    public void finishAuction(Long auctionId) {
        auctionMapper.updateStatusToFinished(auctionId);
    }
}
