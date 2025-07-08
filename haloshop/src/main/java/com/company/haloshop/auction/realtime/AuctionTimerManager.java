package com.company.haloshop.auction.realtime;

import com.company.haloshop.auction.service.AuctionService;
import com.company.haloshop.auction.service.AuctionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import java.util.concurrent.*;

/**
 * 경매 종료를 실시간으로 예약 처리하는 타이머 매니저
 */
@Component
@RequiredArgsConstructor
public class AuctionTimerManager {

    private final AuctionService auctionService;
    private final AuctionResultService auctionResultService;
    private final SimpMessagingTemplate messagingTemplate;

    private ScheduledExecutorService scheduler;
    private Map<Long, ScheduledFuture<?>> timerMap;

    @PostConstruct
    public void init() {
        scheduler = Executors.newScheduledThreadPool(4);
        timerMap = new ConcurrentHashMap<>();
    }

    public void registerAuctionTimer(Long auctionId, LocalDateTime endTime) {
        long delay = endTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli() - System.currentTimeMillis();
        System.out.println("[타이머 등록] auctionId=" + auctionId + ", delay(ms)=" + delay);

        if (delay <= 0 || timerMap.containsKey(auctionId)) {
            System.out.println("[타이머 등록 실패] 이미 등록됨 또는 종료시간 지남 - auctionId=" + auctionId);
            return;
        }

        ScheduledFuture<?> future = scheduler.schedule(() -> {
            System.out.println("[타이머 실행] auctionId=" + auctionId + " 종료 처리 시작");

            // 1. 경매 상태 FINISHED로 변경
            auctionService.finishAuction(auctionId);

            // 2. 4초 지연 후 낙찰자 계산 및 저장
            scheduler.schedule(() -> {
                System.out.println("[낙찰자 계산 예약] auctionId=" + auctionId);
                auctionResultService.saveAuctionResult(auctionId);

                // 3. 클라이언트에 경매 종료 알림
                messagingTemplate.convertAndSend("/topic/auction/" + auctionId, "경매 종료");

                System.out.println("[경매 종료 메시지 전송 완료] auctionId=" + auctionId);
            }, 4, TimeUnit.SECONDS);

            // 4. 타이머 제거
            timerMap.remove(auctionId);
            System.out.println("[타이머 제거 완료] auctionId=" + auctionId);

        }, delay, TimeUnit.MILLISECONDS);

        timerMap.put(auctionId, future);
    }
}
