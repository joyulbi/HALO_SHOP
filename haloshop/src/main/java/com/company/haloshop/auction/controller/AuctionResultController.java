package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.AuctionResult;
import com.company.haloshop.auction.service.AuctionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auction-results")
@RequiredArgsConstructor
public class AuctionResultController {

    private final AuctionResultService auctionResultService;

    // 낙찰 결과 단건 조회
    @GetMapping("/auction/{auctionId}")
    public AuctionResult getByAuctionId(@PathVariable Long auctionId) {
        return auctionResultService.getByAuctionId(auctionId);
    }
    
    // 계정별 낙찰 결과 리스트 조회 (임시로 쿼리파라미터 방식, 추후 인증 세션/토큰에서 accountId 추출)
    @GetMapping("/me")
    public List<AuctionResult> getMyAuctionResults(@RequestParam("accountId") Long accountId) {
        return auctionResultService.getByAccountId(accountId);
    }

    // 낙찰 결과 등록
    @PostMapping
    public void create(@RequestBody AuctionResult auctionResult) {
        auctionResultService.create(auctionResult);
    }

//    // 낙찰 결과 수정
//    @PutMapping
//    public void update(@RequestBody AuctionResult auctionResult) {
//        auctionResultService.update(auctionResult);
//    }

    // 낙찰 결과 삭제
    @DeleteMapping("/auction/{auctionId}")
    public void delete(@PathVariable Long auctionId) {
        auctionResultService.delete(auctionId);
    }

    // --- 구매확정/취소/관리자 메모 API 추가(실제 구조 유지) ---

    // 구매 확정
    @PostMapping("/auction/{auctionId}/confirm")
    public void confirmAuctionResult(@PathVariable Long auctionId, @RequestBody Map<String, Object> body) {
        String adminMemo = body.get("adminMemo") != null ? body.get("adminMemo").toString() : null;
        auctionResultService.confirmAuctionResult(auctionId, adminMemo);
    }

    // 구매 취소
    @PostMapping("/auction/{auctionId}/cancel")
    public void cancelAuctionResult(@PathVariable Long auctionId, @RequestBody Map<String, Object> body) {
        String canceledReason = body.get("canceledReason") != null ? body.get("canceledReason").toString() : null;
        String adminMemo = body.get("adminMemo") != null ? body.get("adminMemo").toString() : null;
        auctionResultService.cancelAuctionResult(auctionId, canceledReason, adminMemo);
    }
}
