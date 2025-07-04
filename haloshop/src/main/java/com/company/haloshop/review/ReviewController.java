package com.company.haloshop.review;

import com.company.haloshop.dto.shop.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    
    // ✅ 리뷰 등록 (텍스트 + 이미지 한 번에 처리)
    @PostMapping
    public ResponseEntity<String> createReview(
        @RequestPart("reviewDto") ReviewDTO reviewDto,
        @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        System.out.println("📥 받은 reviewDto: " + reviewDto);
        System.out.println("📸 받은 이미지 개수: " + (images != null ? images.size() : 0));

        try {
            Long reviewId = reviewService.writeReviewWithImages(reviewDto, images);
            return ResponseEntity.ok("리뷰 등록 성공. ID=" + reviewId);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("리뷰 등록 실패: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }

    // ✅ 내가 쓴 리뷰 전체 조회
    @GetMapping("/user/{accountId}")
    public List<ReviewDTO> getMyReviews(@PathVariable Long accountId) {
        return reviewService.getReviewByUser(accountId);
    }

    // ✅ 리뷰 단건 조회 (리뷰 수정 페이지)
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
    
    // ✅ 상품별 리뷰 전체 조회
    @GetMapping("/item/{itemId}")
    public List<ReviewDTO> getReviewsByItem(@PathVariable Long itemId) {
        return reviewService.getReviewsByItem(itemId);
    }
}
