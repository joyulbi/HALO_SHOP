package com.company.haloshop.review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.shop.ReviewDTO;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> writeReview(@RequestBody ReviewDTO review) {
        try {
            reviewService.writeReview(review);
            return ResponseEntity.ok("리뷰 등록 성공");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("리뷰 등록 실패: " + e.getMessage());
        }
    }
    
    @GetMapping
    public List<ReviewDTO> getAllReviews() {
    	return reviewService.getAllReviews();
    }

    @GetMapping("/user/{accountId}")
    public List<ReviewDTO> getUserReviews(@PathVariable("accountId") Long accountId) {
        return reviewService.getReviewByUser(accountId);
    }

    @GetMapping("/order/{orderItemsId}")
    public ReviewDTO getReviewByOrder(@PathVariable Long orderItemsId) {
        return reviewService.getReviewByOrderItem(orderItemsId);
    }
}


