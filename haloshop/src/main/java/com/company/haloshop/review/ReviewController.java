package com.company.haloshop.review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.company.haloshop.dto.shop.Review;

@Controller
@RequestMapping("/api/reviews")
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
	
	@PostMapping
	public String writeReview(@RequestBody Review review) {
		try {
			reviewService.writeReview(review);
			return "리뷰 등록 성공";
		} catch (IllegalStateException e) {
			return "리뷰 등록 실패: " + e.getMessage();
		}
	}
	
	@GetMapping("/user/{userId}")
	public List<Review> getUserReviews(@PathVariable Long userId) {
		return reviewService.getReviewByUser(userId);
	}
	
	@GetMapping("/order/{orderItemsId}")
	public Review getReviewByOrder(@PathVariable Long orderItemsId) {
		return reviewService.getReviewByOrderItem(orderItemsId);
	}
}
