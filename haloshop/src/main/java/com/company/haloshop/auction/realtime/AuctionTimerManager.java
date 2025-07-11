package com.company.haloshop.auction.realtime;

import com.company.haloshop.auction.service.AuctionService;
import com.company.haloshop.auction.service.AuctionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import java.util.concurrent.*;

/**
 * 경매 시작·종료를 실시간으로 예약 처리하는 타이머 매니저  // ★ 설명 보강
 */
@Component
@RequiredArgsConstructor
public class AuctionTimerManager {

    private final AuctionService auctionService;
    private final AuctionResultService auctionResultService;
    private final SimpMessagingTemplate messagingTemplate;

    private ScheduledExecutorService scheduler;
    // ★ 시작·종료 타이머를 분리해서 저장
    private Map<Long, ScheduledFuture<?>> startTimerMap;
    private Map<Long, ScheduledFuture<?>> endTimerMap;

    @PostConstruct
    public void init() {
        scheduler = Executors.newScheduledThreadPool(4);
        startTimerMap = new ConcurrentHashMap<>();
        endTimerMap   = new ConcurrentHashMap<>();
    }

    /**
     * 경매 하나에 대해 시작·종료 타이머를 모두 등록
     */
    public void registerAuctionTimers(Long auctionId,
                                      LocalDateTime startTime,
                                      LocalDateTime endTime) {

        // ---------------------------
        // 1) 경매 시작 타이머 등록
        // ---------------------------
        long startDelay = millisUntil(startTime);
        System.out.println("[StartTimer 등록] auctionId=" + auctionId + ", delay(ms)=" + startDelay);

        if (startDelay > 0 && !startTimerMap.containsKey(auctionId)) {
            ScheduledFuture<?> startFuture = scheduler.schedule(() -> {
                System.out.println("[StartTimer 실행] auctionId=" + auctionId + " → ONGOING 전환");
                auctionService.startAuction(auctionId); // READY → ONGOING
                messagingTemplate.convertAndSend("/topic/auction/" + auctionId, "경매 시작");
                startTimerMap.remove(auctionId);       // 시작 타이머 제거
            }, startDelay, TimeUnit.MILLISECONDS);
            startTimerMap.put(auctionId, startFuture);
        }

        // ---------------------------
        // 2) 경매 종료 타이머 등록
        // ---------------------------
        long endDelay = millisUntil(endTime);
        System.out.println("[EndTimer 등록] auctionId=" + auctionId + ", delay(ms)=" + endDelay);

        if (endDelay > 0 && !endTimerMap.containsKey(auctionId)) {
            ScheduledFuture<?> endFuture = scheduler.schedule(() -> {
                System.out.println("[EndTimer 실행] auctionId=" + auctionId + " 종료 처리 시작");

                // 2-1. 경매 상태 FINISHED로 변경
                auctionService.finishAuction(auctionId);

                // 2-2. 4초 지연 후 낙찰자 계산 및 저장
                scheduler.schedule(() -> {
                    System.out.println("[낙찰자 계산 예약] auctionId=" + auctionId);
                    auctionResultService.saveAuctionResult(auctionId);

                    // 2-3. 클라이언트에 경매 종료 알림
                    messagingTemplate.convertAndSend("/topic/auction/" + auctionId, "경매 종료");
                    System.out.println("[경매 종료 메시지 전송 완료] auctionId=" + auctionId);
                }, 4, TimeUnit.SECONDS);

                // 2-4. 종료 타이머 제거
                endTimerMap.remove(auctionId);
                System.out.println("[EndTimer 제거 완료] auctionId=" + auctionId);

            }, endDelay, TimeUnit.MILLISECONDS);
            endTimerMap.put(auctionId, endFuture);
        }
    }

    // ------------------------------------------------------
    // 유틸: 특정 시각까지 남은 millis 계산
    // ------------------------------------------------------
    private long millisUntil(LocalDateTime target) {
        return Duration.between(LocalDateTime.now(), target)
                       .toMillis();
    }
}
