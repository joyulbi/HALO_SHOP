package com.company.haloshop.review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Review;

@Service
public class ReviewService {
	@Autowired private ReviewMapper reviewMapper;
	
	public void writeReview(Review review) {
		if (reviewMapper.existsReviewForOrderItem(review.getOrderItemsId())) {
			throw new IllegalStateException("이미 리뷰가 등록된 주문입니다.");
		}
		reviewMapper.insertReview(review);
	}
	
	public List<Review> getReviewByUser(Long userId) {
		return reviewMapper.getReviewByUserId(userId);
	}
	
	public Review getReviewByOrderItem(Long orderItemsId) {
		return reviewMapper.getReviewByOrderItemsId(orderItemsId);
	}
}
