package com.company.haloshop.review.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.ReviewImage;

@Mapper
public interface ReviewImageMapper {
	void insertReviewImage(ReviewImage image);
	List<ReviewImage> findByReviewId(Long reviewId);
}
