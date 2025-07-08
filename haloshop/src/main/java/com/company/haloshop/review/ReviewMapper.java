package com.company.haloshop.review;

import com.company.haloshop.dto.shop.ReviewDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewMapper {

    void insertReview(ReviewDTO review);

    boolean existsByOrderItemId(@Param("orderItemsId") Long orderItemsId);

    ReviewDTO findByOrderItemsId(@Param("orderItemsId") Long orderItemsId);

    List<ReviewDTO> findByAccountId(@Param("accountId") Long accountId);

    List<ReviewDTO> findAll();

    void updateReview(ReviewDTO reviewDTO);

    ReviewDTO findById(@Param("id") Long id);

    void deleteReview(@Param("id") Long id);

    List<ReviewDTO> findByItemId(@Param("itemId") Long itemId);

    List<ReviewDTO> findAllWithProduct();

    void addPointsToUser(@Param("accountId") Long accountId, @Param("point") int point);

    void insertPointLog(@Param("accountId") Long accountId, @Param("amount") int amount, @Param("type") String type);
}
