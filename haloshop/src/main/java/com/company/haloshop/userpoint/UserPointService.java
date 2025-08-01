package com.company.haloshop.userpoint;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.MembershipDto;
import com.company.haloshop.dto.shop.PointLogDto;
import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.membership.MembershipMapper;
import com.company.haloshop.notificationEvent.MembershipUpdatedEvent;
import com.company.haloshop.notificationEvent.PointLogCreatedEvent;
import com.company.haloshop.pointlog.PointLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPointService {

    private final UserPointMapper userPointMapper;
    private final MembershipMapper membershipMapper;
    private final PointLogService pointLogService;
    // 이벤트 발행
    private final ApplicationEventPublisher eventPublisher;

    // 관리자용 전체 조회
    public List<UserPointDto> findAll() {
        return userPointMapper.findAll();
    }

    // 회원별 단일 조회
    public UserPointDto findByAccountId(Long accountId) {
        return userPointMapper.findByAccountId(accountId);
    }

    // 생성
    public void insert(UserPointDto userPoint) {
        userPointMapper.insert(userPoint);
    }

    // 수정
    @Transactional
    public void update(UserPointDto userPoint) {
        UserPointDto existing = userPointMapper.findByAccountId(userPoint.getAccountId());
        if (existing == null) {
            throw new IllegalArgumentException("UserPoint not found for accountId=" + userPoint.getAccountId());
        }

        if (userPoint.getTotalPoint() == null) {
            userPoint.setTotalPoint(existing.getTotalPoint());
        }
        if (userPoint.getTotalPayment() == null) {
            userPoint.setTotalPayment(existing.getTotalPayment());
        }
        if (userPoint.getGrade() == null) {
            userPoint.setGrade(existing.getGrade());
        }

        userPointMapper.update(userPoint);
    }

    // 삭제 (회원 탈퇴 시)
    public void deleteByAccountId(Long accountId) {
        userPointMapper.deleteByAccountId(accountId);
    }

    // 주문 완료 시 포인트 적립 및 등급 갱신 후 적립된 포인트 반환
    @Transactional
    public int updateUserPointAndGrade(Long accountId, Long payAmount) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        Long newTotalPayment;
        int addedPoint = (int) (payAmount * 0.01); // 1% 적립

        if (userPoint == null) {
            newTotalPayment = payAmount;
        } else {
            newTotalPayment = userPoint.getTotalPayment() + payAmount;
        }

        MembershipDto membership = membershipMapper.findBestMatchByTotalPayment(newTotalPayment);
        if (membership != null) {
            addedPoint += membership.getPricePoint();
        }

        if (userPoint == null) {
            userPoint = new UserPointDto();
            userPoint.setAccountId(accountId);
            userPoint.setTotalPayment(newTotalPayment);
            userPoint.setTotalPoint((long) addedPoint);
            userPoint.setGrade(membership != null ? membership.getName() : "BASIC");
            userPoint.setUpdatedAt(LocalDateTime.now());
            userPointMapper.insert(userPoint);
        } else {
            userPoint.setTotalPayment(newTotalPayment);
            userPoint.setTotalPoint(userPoint.getTotalPoint() + addedPoint);
            userPoint.setGrade(membership != null ? membership.getName() : userPoint.getGrade());
            userPoint.setUpdatedAt(LocalDateTime.now());
            userPointMapper.update(userPoint);
        }

        // 포인트 적립 로그
        PointLogDto logDto = new PointLogDto();
        logDto.setAccountId(accountId);
        logDto.setAmount(addedPoint);
        logDto.setType("SAVE");
        logDto.setCreatedAt(LocalDateTime.now());
        pointLogService.insert(logDto);

        return addedPoint;
    }

    @Transactional
    public int deductPointByOrder(Long accountId, Long payAmount) {
        int deductPoint = (int) (payAmount * 0.01);
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        if (userPoint == null) {
            throw new IllegalArgumentException("UserPoint not found for accountId=" + accountId);
        }
        userPoint.setTotalPoint(userPoint.getTotalPoint() - deductPoint);
        userPoint.setUpdatedAt(LocalDateTime.now());
        userPointMapper.update(userPoint);

        // 포인트 차감 로그
        PointLogDto logDto = new PointLogDto();
        logDto.setAccountId(accountId);
        logDto.setAmount(deductPoint);
        logDto.setType("REFUND_DEDUCT");
        logDto.setCreatedAt(LocalDateTime.now());
        pointLogService.insert(logDto);

        return deductPoint;
    }

    @Transactional
    public void restorePoint(Long accountId, int restoreAmount) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        if (userPoint == null) {
            throw new IllegalArgumentException("UserPoint not found for accountId=" + accountId);
        }
        userPoint.setTotalPoint(userPoint.getTotalPoint() + restoreAmount);
        userPoint.setUpdatedAt(LocalDateTime.now());
        userPointMapper.update(userPoint);

        // 사용 포인트 복원 로그
        PointLogDto logDto = new PointLogDto();
        logDto.setAccountId(accountId);
        logDto.setAmount(restoreAmount);
        logDto.setType("REFUND_RESTORE");
        logDto.setCreatedAt(LocalDateTime.now());
        pointLogService.insert(logDto);
    }

    @Transactional
    public void usePoint(Long accountId, int useAmount) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        if (userPoint == null || userPoint.getTotalPoint() < useAmount) {
            throw new IllegalArgumentException("포인트가 부족하여 사용할 수 없습니다.");
        }
        userPoint.setTotalPoint(userPoint.getTotalPoint() - useAmount);
        userPoint.setUpdatedAt(LocalDateTime.now());
        userPointMapper.update(userPoint);

        // 포인트 사용 로그
        PointLogDto logDto = new PointLogDto();
        logDto.setAccountId(accountId);
        logDto.setAmount(useAmount);
        logDto.setType("USE");
        logDto.setCreatedAt(LocalDateTime.now());
        pointLogService.insert(logDto);
    }

    @Transactional
    public void adjustPointManually(Long accountId, int adjustToAmount) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        if (userPoint == null) {
            userPoint = new UserPointDto();
            userPoint.setAccountId(accountId);
            userPoint.setTotalPoint((long) adjustToAmount);
            userPoint.setTotalPayment(0L);
            userPoint.setGrade("BASIC");
            userPoint.setUpdatedAt(LocalDateTime.now());
            userPointMapper.insert(userPoint);

            // 최초 생성 시 로그
            PointLogDto logDto = new PointLogDto();
            logDto.setAccountId(accountId);
            logDto.setAmount(adjustToAmount);
            logDto.setType("수동입력");
            logDto.setCreatedAt(LocalDateTime.now());
            pointLogService.insert(logDto);
        } else {
            long before = userPoint.getTotalPoint();
            long diff = adjustToAmount - before;
            userPoint.setTotalPoint((long) adjustToAmount);
            userPoint.setUpdatedAt(LocalDateTime.now());
            userPointMapper.update(userPoint);

            if (diff != 0) {
                PointLogDto logDto = new PointLogDto();
                logDto.setAccountId(accountId);
                logDto.setAmount((int) diff);
                logDto.setType("수동입력");
                logDto.setCreatedAt(LocalDateTime.now());
                pointLogService.insert(logDto);
            }
        }
    }

    /**
     * 회원가입 시 호출하여 UserPoint 초기 레코드를 생성합니다.
     * grade: BASIC, totalPayment: 0, totalPoint: 0
     */
    @Transactional
    public void initializeUserPoint(Long accountId) {
        UserPointDto dto = new UserPointDto();
        dto.setAccountId(accountId);
        dto.setGrade("BASIC");
        dto.setTotalPayment(0L);
        dto.setTotalPoint(0L);
        dto.setUpdatedAt(LocalDateTime.now());
        userPointMapper.insert(dto);

        // 초기 포인트 로그
        PointLogDto logDto = new PointLogDto();
        logDto.setAccountId(accountId);
        logDto.setAmount(0);
        logDto.setType("INITIAL");
        logDto.setCreatedAt(LocalDateTime.now());
        pointLogService.insert(logDto);
    }
    @Transactional
    public void updateUserGrade(Long accountId, String grade) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        if (userPoint == null) {
            throw new IllegalArgumentException("UserPoint not found for accountId=" + accountId);
        }
        userPoint.setGrade(grade);
        userPoint.setUpdatedAt(LocalDateTime.now());
        userPointMapper.update(userPoint);
    }
    public int updateUserPoint(Long accountId, Long payAmount) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        int savePoint = (int)(payAmount * 0.01); // 1% 적립

        if (userPoint != null) {
            userPoint.setTotalPayment(userPoint.getTotalPayment() + payAmount);
            userPoint.setTotalPoint(userPoint.getTotalPoint() + savePoint);
            // ❌ 등급은 건드리지 않음
            userPointMapper.update(userPoint);
        } else {
            // 첫 구매 시 user_point row 생성
            UserPointDto newUserPoint = new UserPointDto();
            newUserPoint.setAccountId(accountId);
            newUserPoint.setTotalPayment(payAmount);
            newUserPoint.setTotalPoint((long) savePoint);
            //newUserPoint.setGrade("기본"); // 표준화하여 추가
            userPointMapper.insert(newUserPoint);
        }
        return savePoint;
    }
    
    @Transactional
    public void addMembershipRewardPoint(Long accountId, int rewardPoint) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        if (userPoint != null) {
            userPoint.setTotalPoint(userPoint.getTotalPoint() + rewardPoint);
            userPoint.setUpdatedAt(LocalDateTime.now());
            userPointMapper.update(userPoint);

            // 포인트 적립 로그 기록
            PointLogDto logDto = new PointLogDto();
            logDto.setAccountId(accountId);
            logDto.setAmount(rewardPoint);
            logDto.setType("MEMBERSHIP_REWARD");
            logDto.setCreatedAt(LocalDateTime.now());
            pointLogService.insert(logDto);
            // 포인트 적립 알림 이벤트 발행
            eventPublisher.publishEvent(new PointLogCreatedEvent(this, logDto));
        } else {
            throw new IllegalArgumentException("UserPoint not found for accountId=" + accountId);
        }
    }



}
