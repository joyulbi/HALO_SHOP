package com.company.haloshop.review;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.ReviewDTO;

@Mapper
public interface ReviewMapper {
	void insertReview(ReviewDTO review);
	boolean existsByOrderItemId(Long orderItemsId);
	List<ReviewDTO> findByAccountId(Long accountId);
	ReviewDTO findByOrderItemsId(Long orderItemsId);
	List<ReviewDTO> findAll();

	// 리뷰 수정
	void updateReview(ReviewDTO reviewDTO);
	ReviewDTO findById(Long id);
	
	// 리뷰 삭제
	void deleteReview(Long id);
}
