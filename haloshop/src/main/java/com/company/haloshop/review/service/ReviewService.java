package com.company.haloshop.review.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.ReviewDTO;
import com.company.haloshop.review.mapper.ReviewMapper;

@Service
public class ReviewService {
	@Autowired private ReviewMapper reviewMapper;
	
	public void writeReview(ReviewDTO review) {
		if (reviewMapper.existsReviewForOrderItem(review.getOrderItemsId())) {
			throw new IllegalStateException("이미 리뷰가 등록된 주문입니다.");
		}
		reviewMapper.insertReview(review);
	}
	
	public List<ReviewDTO> getReviewByUser(Long userId) {
		return reviewMapper.getReviewByUserId(userId);
	}
	
	public ReviewDTO getReviewByOrderItem(Long orderItemsId) {
		return reviewMapper.getReviewByOrderItemsId(orderItemsId);
	}
}

