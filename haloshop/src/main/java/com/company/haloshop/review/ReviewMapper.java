package com.company.haloshop.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.Review;

@Mapper
public interface ReviewMapper {
	void insertReview(Review review);
	boolean existsReviewForOrderItem(Long orderItemsId);
	List<Review> getReviewByUserId(Long userId);
	Review getReviewByOrderItemsId(Long orderItemsId);
}
