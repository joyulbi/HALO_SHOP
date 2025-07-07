package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.service.AuctionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auction-logs")
@RequiredArgsConstructor
public class AuctionLogController {

    private final AuctionLogService auctionLogService;

    // 입찰 로그 단건 조회 (조회는 허용)
    @GetMapping("/{id}")
    public AuctionLog getById(@PathVariable Long id) {
        return auctionLogService.getById(id);
    }

    // 특정 경매의 입찰 로그 목록 조회
    @GetMapping("/auction/{auctionId}")
    public List<AuctionLog> getByAuctionId(@PathVariable Long auctionId) {
        return auctionLogService.getByAuctionId(auctionId);
    }

    /**
     * 입찰(등록) 전용 엔드포인트
     * - 반드시 AuctionLogService.bid()로 정책/유효성/예외 다 통과해야만 입찰 성공
     * - @RequestParam 권장 (프론트에서 Form 또는 JSON으로 보내도 호환)
     */
    @PostMapping("/bid")
    public ResponseEntity<?> bid(@RequestParam Long auctionId,
                                 @RequestParam Long accountId,
                                 @RequestParam int price) {
        try {
            auctionLogService.bid(auctionId, accountId, price);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            // 실패시 메시지 반환
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
