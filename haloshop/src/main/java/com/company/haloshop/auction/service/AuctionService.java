package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.mapper.AuctionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionMapper auctionMapper;

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
    public void delete(Long id) {
        auctionMapper.delete(id);
    }
}
