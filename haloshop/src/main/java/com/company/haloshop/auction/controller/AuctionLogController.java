package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.service.AuctionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auction-logs")
@RequiredArgsConstructor
public class AuctionLogController {

    private final AuctionLogService auctionLogService;

    // 입찰 로그 단건 조회
    @GetMapping("/{id}")
    public AuctionLog getById(@PathVariable Long id) {
        return auctionLogService.getById(id);
    }

    // 특정 경매의 입찰 로그 목록 조회
    @GetMapping("/auction/{auctionId}")
    public List<AuctionLog> getByAuctionId(@PathVariable Long auctionId) {
        return auctionLogService.getByAuctionId(auctionId);
    }

    // 입찰 로그 등록
    @PostMapping
    public void create(@RequestBody AuctionLog auctionLog) {
        auctionLogService.create(auctionLog);
    }

    // 입찰 로그 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        auctionLogService.delete(id);
    }
}
