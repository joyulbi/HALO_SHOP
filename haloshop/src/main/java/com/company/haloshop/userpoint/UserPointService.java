package com.company.haloshop.userpoint;

import java.time.LocalDateTime;
import java.util.List;
import com.company.haloshop.pointlog.PointLogService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.MembershipDto;
import com.company.haloshop.dto.shop.PointLogDto;
import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.membership.MembershipMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPointService {

    private final UserPointMapper userPointMapper;
    private final MembershipMapper membershipMapper;
    private final PointLogService pointLogService;

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
    public void update(UserPointDto userPoint) {
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

        return addedPoint;
    }

    @Transactional
    public int deductPointByOrder(Long accountId, Long payAmount) {
        int deductPoint = (int) (payAmount * 0.01);
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        userPoint.setTotalPoint(userPoint.getTotalPoint() - deductPoint);
        userPoint.setUpdatedAt(LocalDateTime.now());
        userPointMapper.update(userPoint);
        return deductPoint;
    }

    @Transactional
    public void restorePoint(Long accountId, int restoreAmount) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        userPoint.setTotalPoint(userPoint.getTotalPoint() + restoreAmount);
        userPoint.setUpdatedAt(LocalDateTime.now());
        userPointMapper.update(userPoint);
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
    }
    
    @Transactional
    public void adjustPointManually(Long accountId, int adjustAmount, String adjustType) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        if (userPoint == null) {
            userPoint = new UserPointDto();
            userPoint.setAccountId(accountId);
            userPoint.setTotalPoint((long) adjustAmount);
            userPoint.setTotalPayment(0L);
            userPoint.setGrade("BASIC");
            
            userPoint.setUpdatedAt(LocalDateTime.now());
            userPointMapper.insert(userPoint);
        } else {
            userPoint.setTotalPoint(userPoint.getTotalPoint() + adjustAmount);
            userPoint.setUpdatedAt(LocalDateTime.now());
            userPointMapper.update(userPoint);
        }

        PointLogDto pointLogDto = new PointLogDto();
        pointLogDto.setAccountId(accountId);
        pointLogDto.setAmount(adjustAmount);
        pointLogDto.setType(adjustType);  // "MANUAL_ADJUST" or "MANUAL_ADD_이벤트" 등
        pointLogDto.setCreatedAt(LocalDateTime.now());
        pointLogService.insert(pointLogDto);
    }



}