package com.company.haloshop.review;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.company.haloshop.dto.shop.ReviewDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewMapper reviewMapper;
    private final ReviewImageMapper reviewImageMapper;

    private static final String UPLOAD_DIR = "/upload/review/";

    // ✅ 리뷰 등록 + 이미지 저장 + 포인트 지급
    @Transactional
    public Long writeReviewWithImagesAndPoints(ReviewDTO review, List<MultipartFile> images) {
        if (reviewMapper.existsByOrderItemId(review.getOrderItemsId())) {
            throw new IllegalStateException("이미 이 주문에 대한 리뷰가 존재합니다.");
        }

        // 리뷰 저장
        review.setCreatedAt(LocalDateTime.now());
        reviewMapper.insertReview(review);
        Long reviewId = review.getId();

        // 이미지 저장
        if (images != null && !images.isEmpty()) {
            saveReviewImages(reviewId, images);
        }

        // ✅ 포인트 지급: 리뷰 내용 20자 이상
        if (review.getContent() != null && review.getContent().trim().length() >= 20) {
            int rewardPoint = 100; // 포인트 값
            reviewMapper.addPointsToUser(review.getAccountId(), rewardPoint);
            reviewMapper.insertPointLog(review.getAccountId(), rewardPoint, "리뷰 작성");
            System.out.println("✅ 포인트 " + rewardPoint + " 지급 및 로그 기록 완료");
        } else {
            System.out.println("⚠ 리뷰 20자 미만 → 포인트 지급 안 함");
        }

        return reviewId;
    }

    private void saveReviewImages(Long reviewId, List<MultipartFile> images) {
        for (MultipartFile file : images) {
            String savedPath = saveFile(file);
            LocalDateTime uploadedAt = LocalDateTime.now();
            reviewImageMapper.insertReviewImage(reviewId, savedPath, uploadedAt);
            System.out.println("이미지 저장 완료: reviewId=" + reviewId + ", path=" + savedPath);
        }
    }

    private String saveFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/upload/review/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패: " + file.getOriginalFilename(), e);
        }
    }

    // ✅ 수정: 상품명 + 이미지 조인된 쿼리 사용
    public List<ReviewDTO> getReviewByUser(Long accountId) {
        return reviewMapper.findWithImagesByAccountId(accountId);
    }

    public ReviewDTO getReviewByOrderItem(Long orderItemsId) {
        return reviewMapper.findByOrderItemsId(orderItemsId);
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewMapper.findAll();
    }

    @Transactional(readOnly = true)
    public ReviewDTO getReviewById(Long id) {
        ReviewDTO review = reviewMapper.findById(id);
        if (review != null) {
            List<String> urls = reviewImageMapper.findUrlsByReviewId(id);
            review.setImages(urls);
        }
        return review;
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
        reviewImageMapper.deleteByReviewId(id);
    }

    public List<ReviewDTO> getReviewsByItem(Long itemId) {
        List<ReviewDTO> reviews = reviewMapper.findByItemId(itemId);
        for (ReviewDTO review : reviews) {
            List<String> urls = reviewImageMapper.findUrlsByReviewId(review.getId());
            review.setImages(urls);
        }
        return reviews;
    }

    public List<ReviewDTO> getAllReviewsForAdmin() {
        return reviewMapper.findAllWithProduct();
    }
}
