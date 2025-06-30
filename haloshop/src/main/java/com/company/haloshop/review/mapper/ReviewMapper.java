package com.company.haloshop.review.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.ReviewDTO;

@Mapper
public interface ReviewMapper {
	void insertReview(ReviewDTO review);
	boolean existsReviewForOrderItem(Long orderItemsId);
	List<ReviewDTO> getReviewByUserId(Long userId);
	ReviewDTO getReviewByOrderItemsId(Long orderItemsId);
}

