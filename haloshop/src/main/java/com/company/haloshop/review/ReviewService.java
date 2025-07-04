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

    // 📦 실제 운영 서버에서는 외부 경로 추천
    private static final String UPLOAD_DIR = "/upload/review/"; 

    // ✅ 리뷰 등록 + 이미지 저장 (트랜잭션 통합)
    @Transactional
    public Long writeReviewWithImages(ReviewDTO review, List<MultipartFile> images) {
        if (reviewMapper.existsByOrderItemId(review.getOrderItemsId())) {
            throw new IllegalStateException("이미 이 주문에 대한 리뷰가 존재합니다.");
        }

        // 리뷰 저장
        review.setCreatedAt(LocalDateTime.now());
        reviewMapper.insertReview(review); // review.getId() 생성됨
        Long reviewId = review.getId();

        // 이미지 저장
        if (images != null && !images.isEmpty()) {
            saveReviewImages(reviewId, images);
        }
        return reviewId;
    }

    // ✅ 이미지 경로 DB 저장 + 파일 저장
    private void saveReviewImages(Long reviewId, List<MultipartFile> images) {
        for (MultipartFile file : images) {
            String savedPath = saveFile(file);
            LocalDateTime uploadedAt = LocalDateTime.now();
            reviewImageMapper.insertReviewImage(reviewId, savedPath, uploadedAt);
            System.out.println("이미지 저장 완료: reviewId=" + reviewId + ", path=" + savedPath);
        }
    }

    // ✅ 파일 저장 (UUID + 원본 파일명)
    private String saveFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/upload/review/" + fileName; // 웹에서 접근 가능한 경로 반환
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패: " + file.getOriginalFilename(), e);
        }
    }

    // ✅ 내가 쓴 리뷰 목록 조회
    public List<ReviewDTO> getReviewByUser(Long accountId) {
        List<ReviewDTO> reviews = reviewMapper.findByAccountId(accountId);
        for (ReviewDTO review : reviews) {
            List<String> urls = reviewImageMapper.findUrlsByReviewId(review.getId());
            review.setImages(urls);
        }
        return reviews;
    }

    // ✅ 특정 주문 아이템의 리뷰 조회
    public ReviewDTO getReviewByOrderItem(Long orderItemsId) {
        return reviewMapper.findByOrderItemsId(orderItemsId);
    }

    // ✅ 모든 리뷰 조회
    public List<ReviewDTO> getAllReviews() {
        return reviewMapper.findAll();
    }

    // ✅ 리뷰 단건 조회
    @Transactional(readOnly = true)
    public ReviewDTO getReviewById(Long id) {
        ReviewDTO review = reviewMapper.findById(id);
        if (review != null) {
            List<String> urls = reviewImageMapper.findUrlsByReviewId(id);
            review.setImages(urls);
        }
        return review;
    }

    // ✅ 리뷰 수정
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

    // ✅ 리뷰 삭제
    @Transactional
    public void deleteReview(Long id) {
        ReviewDTO review = reviewMapper.findById(id);
        if (review == null) {
            throw new IllegalArgumentException("리뷰가 존재하지 않습니다.");
        }
        reviewMapper.deleteReview(id);
        reviewImageMapper.deleteByReviewId(id);
    }
}
