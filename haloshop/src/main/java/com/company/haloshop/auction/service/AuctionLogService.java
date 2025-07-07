package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.dto.AuctionLog;
import com.company.haloshop.auction.mapper.AuctionLogMapper;
import com.company.haloshop.auction.mapper.AuctionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionLogService {

    private final AuctionLogMapper auctionLogMapper;
    private final AuctionMapper auctionMapper;

    // 단건 조회
    public AuctionLog getById(Long id) {
        return auctionLogMapper.selectById(id);
    }

    // 특정 경매의 입찰 로그 전체 조회
    public List<AuctionLog> getByAuctionId(Long auctionId) {
        return auctionLogMapper.selectByAuctionId(auctionId);
    }

    /**
     * 입찰 처리 로직
     * - 경매가 진행중(ONGOING)이고, 현재 시간이 시작~종료시간 사이일 때만 입찰 가능
     * - 첫 입찰은 시작가와 정확히 동일해야 함
     * - 두 번째 입찰부터는 현재 최고가의 10% 이상, 100원 단위로만 가능
     * - 동일 유저 연속 입찰 불가
     * - 모든 유효성 통과 시에만 입찰 로그 DB insert
     */
    @Transactional
    public void bid(Long auctionId, Long accountId, int price) {
        // 1. 경매 정보 조회
        Auction auction = auctionMapper.selectById(auctionId);
        if (auction == null) throw new RuntimeException("경매 정보 없음");

        LocalDateTime now = LocalDateTime.now();

        // 2. 경매 상태/시간 체크
        if (!"ONGOING".equals(auction.getStatus()))
            throw new RuntimeException("경매가 진행중이 아닙니다.");
        if (now.isBefore(auction.getStartTime()) || now.isAfter(auction.getEndTime()))
            throw new RuntimeException("입찰 가능 시간이 아닙니다.");

        // 3. 기존 입찰 로그(최신순) 조회
        List<AuctionLog> logs = auctionLogMapper.selectByAuctionIdOrderByCreatedAtDesc(auctionId);

        if (logs.isEmpty()) {
            // 첫 입찰: 시작가와 동일해야 함
            if (price != auction.getStartPrice())
                throw new RuntimeException("첫 입찰은 시작가(" + auction.getStartPrice() + "원)로만 가능합니다.");
        } else {
            AuctionLog latest = logs.get(0);

            // (1) 동일 유저 연속 입찰 금지
            if (latest.getAccountId().equals(accountId))
                throw new RuntimeException("본인 연속 입찰은 불가합니다.");

            // (2) 최소 입찰가 = 최고가의 10% 이상 + 100원 단위 반올림
            int minPrice = (int) (Math.ceil(latest.getPrice() * 1.10 / 100.0) * 100);

            if (price < minPrice)
                throw new RuntimeException("최소 입찰 가능 금액은 " + minPrice + "원 이상입니다.");

            // (3) 100원 단위 체크
            if (price % 100 != 0)
                throw new RuntimeException("입찰 금액은 100원 단위로만 가능합니다.");
        }

        // 4. 모든 조건 통과 → 입찰 로그 등록(DB insert)
        AuctionLog newLog = new AuctionLog();
        newLog.setAuctionId(auctionId);
        newLog.setAccountId(accountId);
        newLog.setPrice(price);
        newLog.setCreatedAt(LocalDateTime.now());
        auctionLogMapper.insert(newLog);
    }

    // 입찰 로그 삭제 (관리자/운영자 용도)
    public void delete(Long id) {
        auctionLogMapper.delete(id);
    }
}
