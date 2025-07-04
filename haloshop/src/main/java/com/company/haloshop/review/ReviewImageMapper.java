package com.company.haloshop.review;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReviewImageMapper {
    void insertReviewImage(@Param("reviewId") Long reviewId,
    					   @Param("url") String url,
    					   @Param("uploadedAt") LocalDateTime uploadedAt);
    
    List<String> findUrlsByReviewId(@Param("reviewId") Long reviewId);
    void deleteByReviewId(Long reviewId);
}
