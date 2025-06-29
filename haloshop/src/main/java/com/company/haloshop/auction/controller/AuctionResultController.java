package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionResult;
import com.company.haloshop.auction.service.AuctionResultService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auction-results")
public class AuctionResultController {
    private final AuctionResultService auctionResultService;

    public AuctionResultController(AuctionResultService auctionResultService) {
        this.auctionResultService = auctionResultService;
    }

    // 낙찰 결과 단건 조회
    @GetMapping("/auction/{auctionId}")
    public AuctionResult getByAuctionId(@PathVariable Long auctionId) {
        return auctionResultService.getByAuctionId(auctionId);
    }

    // 낙찰 결과 등록
    @PostMapping
    public void create(@RequestBody AuctionResult auctionResult) {
        auctionResultService.create(auctionResult);
    }

    // 낙찰 결과 수정
    @PutMapping
    public void update(@RequestBody AuctionResult auctionResult) {
        auctionResultService.update(auctionResult);
    }

    // 낙찰 결과 삭제
    @DeleteMapping("/auction/{auctionId}")
    public void delete(@PathVariable Long auctionId) {
        auctionResultService.delete(auctionId);
    }
}
