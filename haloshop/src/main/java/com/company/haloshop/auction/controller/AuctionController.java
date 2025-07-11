package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.realtime.AuctionTimerManager;
import com.company.haloshop.auction.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final AuctionTimerManager auctionTimerManager;

    // 경매 단건 조회
    @GetMapping("/{id}")
    public Auction getById(@PathVariable Long id) {
        return auctionService.getById(id);
    }

    // 전체 경매 목록 조회
    @GetMapping
    public List<Auction> getAll() {
        return auctionService.getAll();
    }

    // 경매 등록
    @PostMapping
    public Auction create(@RequestBody Auction auction) {
        auctionService.create(auction);
        auctionTimerManager.registerAuctionTimers(
            auction.getId(),
            auction.getStartTime(),
            auction.getEndTime()
        );
        System.out.println("[경매 등록 완료] id=" + auction.getId());
        return auction;
    }
    
    // 경매 수정
    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody Auction auction) {
        auction.setId(id);
        auctionService.update(auction);
    }

    // 경매 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        auctionService.delete(id);
    }
}
