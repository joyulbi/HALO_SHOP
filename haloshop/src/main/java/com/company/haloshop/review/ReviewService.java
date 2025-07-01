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
    private final ReviewImageMapper reviewImageMapper;

    @Transactional
    public Long writeReview(ReviewDTO review) {
        if (reviewMapper.existsByOrderItemId(review.getOrderItemsId())) {
            throw new IllegalStateException("이미 이 주문에 대한 리뷰가 존재합니다.");
        }
        review.setCreatedAt(LocalDateTime.now());
        reviewMapper.insertReview(review); // 여기서 review.getId() 값이 생성됨

        return review.getId(); // ✅ reviewId 반환
    }

    public List<ReviewDTO> getReviewByUser(Long accountId) {
        List<ReviewDTO> reviews = reviewMapper.findByAccountId(accountId);

        for (ReviewDTO review : reviews) {
            List<String> urls = reviewImageMapper.findUrlsByReviewId(review.getId());
            review.setImages(urls);
        }

        return reviews;
    }

    public ReviewDTO getReviewByOrderItem(Long orderItemsId) {
        return reviewMapper.findByOrderItemsId(orderItemsId);
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewMapper.findAll();
    }
    
    @Transactional(readOnly = true)
    public ReviewDTO getReviewById(Long id) {
        return reviewMapper.findById(id);
    }

    @Transactional
    public void updateReview(Long id, ReviewDTO updated) {
        ReviewDTO original = reviewMapper.findById(id);
        if (original == null) {
            throw new IllegalArgumentException("리뷰가 존재하지 않습니다.");
        }
        original.setContent(updated.getContent());
        original.setRating(updated.getRating());
        reviewMapper.updateReview(original);
    }

    @Transactional
    public void deleteReview(Long id) {
        ReviewDTO review = reviewMapper.findById(id);
        if (review == null) {
            throw new IllegalArgumentException("리뷰가 존재하지 않습니다.");
        }
        reviewMapper.deleteReview(id);
    }


}
