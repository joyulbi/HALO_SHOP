package com.company.haloshop.review.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.company.haloshop.dto.shop.ReviewDTO;
import com.company.haloshop.review.service.ReviewService;

@Controller
@RequestMapping("/mypage/reviews")
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
	
	@PostMapping
	public String writeReview(@RequestBody ReviewDTO review) {
		try {
			reviewService.writeReview(review);
			return "리뷰 등록 성공";
		} catch (IllegalStateException e) {
			return "리뷰 등록 실패: " + e.getMessage();
		}
	}
	
	@GetMapping("/user/{accountId}")
	public List<ReviewDTO> getUserReviews(@PathVariable("account_id") Long accountId) {
		return reviewService.getReviewByUser(accountId);
	}
	
	@GetMapping("/order/{orderItemsId}")
	public ReviewDTO getReviewByOrder(@PathVariable Long orderItemsId) {
		return reviewService.getReviewByOrderItem(orderItemsId);
	}
}

