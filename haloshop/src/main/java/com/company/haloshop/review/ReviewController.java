package com.company.haloshop.review;

import com.company.haloshop.dto.shop.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ✅ 리뷰 전체 조회 (내가 쓴 리뷰)
    @GetMapping("/user/{accountId}")
    public List<ReviewDTO> getMyReviews(@PathVariable Long accountId) {
        return reviewService.getReviewByUser(accountId);
    }

    // ✅ 리뷰 단건 조회 (리뷰 수정 페이지에서 사용)
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
        ReviewDTO review = reviewService.getReviewById(id);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(review);
    }

    // ✅ 리뷰 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateReview(@PathVariable Long id, @RequestBody ReviewDTO updated) {
        try {
            reviewService.updateReview(id, updated);
            return ResponseEntity.ok("리뷰 수정 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("리뷰 수정 실패: " + e.getMessage());
        }
    }

    // ✅ 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok("리뷰 삭제 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("리뷰 삭제 실패: " + e.getMessage());
        }
    }
}
