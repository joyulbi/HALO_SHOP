package com.company.haloshop.userpoint;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.MembershipDto;
import com.company.haloshop.dto.shop.UserPointDto;
import com.company.haloshop.membership.MembershipMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPointService {

    private final UserPointMapper userPointMapper;
    private final MembershipMapper membershipMapper;

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

    // 주문 완료 시 포인트 적립 및 등급 갱신
    @Transactional
    public void updateUserPointAndGrade(Long accountId, Long totalPrice) {
        UserPointDto userPoint = userPointMapper.findByAccountId(accountId);
        Long newTotalPayment;
        Long addedPoint = totalPrice / 100; // 기본 1% 적립

        if (userPoint == null) {
            newTotalPayment = totalPrice;
        } else {
            newTotalPayment = userPoint.getTotalPayment() + totalPrice;
        }

        // 멤버십 등급 및 포인트 조회
        MembershipDto membership = membershipMapper.findBestMatchByTotalPayment(newTotalPayment);

        if (membership != null) {
            addedPoint += membership.getPricePoint(); // 멤버십 추가 포인트 적립
        }

        if (userPoint == null) {
            userPoint = new UserPointDto();
            userPoint.setAccountId(accountId);
            userPoint.setTotalPayment(newTotalPayment);
            userPoint.setTotalPoint(addedPoint);
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
    }
}
