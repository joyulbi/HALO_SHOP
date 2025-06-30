package com.company.haloshop.review;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.ReviewDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;

    @Transactional
    public void writeReview(ReviewDTO review) {
        if (reviewMapper.existsByOrderItemId(review.getOrderItemsId())) {
            throw new IllegalStateException("이미 이 주문에 대한 리뷰가 존재합니다.");
        }
        review.setCreatedAt(LocalDateTime.now());
        reviewMapper.insertReview(review);
    }

    public List<ReviewDTO> getReviewByUser(Long accountId) {
        return reviewMapper.findByAccountId(accountId);
    }

    public ReviewDTO getReviewByOrderItem(Long orderItemsId) {
        return reviewMapper.findByOrderItemsId(orderItemsId);
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewMapper.findAll();
    }
}
