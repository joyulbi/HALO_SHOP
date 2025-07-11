package com.company.haloshop.membership;

import java.time.LocalDate;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.company.haloshop.dto.shop.MembershipDto;
import com.company.haloshop.dto.shop.UserPaymentSummaryDto;
import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.notificationEvent.MembershipUpdatedEvent;
import com.company.haloshop.notificationEvent.PointLogCreatedEvent;
import com.company.haloshop.order.OrderMapper;
import com.company.haloshop.userpoint.UserPointMapper;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class MembershipGradeScheduler {

    private final OrderMapper orderMapper;
    private final MembershipMapper membershipMapper;
    private final UserPointMapper userPointMapper;
    private final UserPointService userPointService;
    // 이벤트 발행
    private final ApplicationEventPublisher eventPublisher;
    
    
    //@Scheduled(cron = "0 * * * * *")
    @Scheduled(cron = "0 0 0 1 * *") 
    public void updateMembershipGrades() {
        log.info("🔄 멤버십 등급 갱신 스케줄러 시작");

        /*LocalDate now = LocalDate.now();
        LocalDate firstDayOfLastMonth = now.minusMonths(1).withDayOfMonth(1);
        LocalDate firstDayOfThisMonth = now.withDayOfMonth(1);

        List<UserPaymentSummaryDto> paymentSummaries = orderMapper.getMonthlyPaymentSummary(
                firstDayOfLastMonth.toString(),
                firstDayOfThisMonth.toString()
        );*/
        LocalDate now = LocalDate.now();
        LocalDate firstDayOfThisMonth = now.withDayOfMonth(1);
        LocalDate firstDayOfNextMonth = now.plusMonths(1).withDayOfMonth(1);

        List<UserPaymentSummaryDto> paymentSummaries = orderMapper.getMonthlyPaymentSummary(
            firstDayOfThisMonth.toString(),
            firstDayOfNextMonth.toString()
        );

        for (UserPaymentSummaryDto summary : paymentSummaries) {
            Long accountId = summary.getAccountId();
            Long totalPayment = summary.getTotalPayment();

            log.info("⭐ 등급 갱신 시도: accountId={}, 전달 totalPayment={}", accountId, totalPayment);

            MembershipDto membership = membershipMapper.findBestMatchByTotalPayment(totalPayment);

            if (membership != null) {
                log.info("⭐ accountId={}, 매칭된 membership.name={}, membership.price={}", accountId, membership.getName(), membership.getPrice());

                UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
                if (userPoint != null) {
                    userPoint.setGrade(membership.getName());
                    userPointMapper.update(userPoint);
                    log.info("✅ {}번 사용자 등급 {}로 갱신 완료 (전월 사용 금액: {})", accountId, membership.getName(), totalPayment);
                    // 등급변동 이벤트 발행
                    eventPublisher.publishEvent(new MembershipUpdatedEvent(this, userPoint));

                    // ✅ 멤버십 포인트 지급 로직 추가
                    int rewardPoint = membership.getPricePoint();
                    if (rewardPoint > 0) {
                        userPointService.addMembershipRewardPoint(accountId, rewardPoint);
                        log.info("✅ {}번 사용자에게 멤버십 등급 갱신 포인트 {}P 지급 완료", accountId, rewardPoint);
                       
                        
                    }
                }
            }


        log.info("✅ 멤버십 등급 갱신 스케줄러 완료");
    }
    }}
