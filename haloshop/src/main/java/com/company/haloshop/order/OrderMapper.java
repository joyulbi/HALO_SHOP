package com.company.haloshop.order;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderRequestDto;
import com.company.haloshop.dto.shop.UserPaymentSummaryDto;

@Mapper
public interface OrderMapper {
    void insert(OrderRequestDto orderRequestDto);

    List<OrderDto> findAll();
    List<OrderDto> findByAccountId(@Param("accountId") Long accountId);

    OrderDto findById(Long id);

    void insert(OrderDto orderDto);

    void update(OrderDto orderDto);

    void delete(Long id);
    
    void insertOrderWithItems(OrderRequestDto orderRequestDto); // ✅ 추가


    // ✅ 카카오페이 연동용 TID 업데이트
    void updateTid(@Param("id") Long id, @Param("tid") String tid);

    // ✅ 카카오페이 연동용 결제 상태 업데이트
    void updateStatus(@Param("id") Long id, @Param("paymentStatus") String paymentStatus);
    
    OrderDto findLatestPendingByAccountId(@Param("accountId") Long accountId);
    
    List<UserPaymentSummaryDto> getMonthlyPaymentSummary(
    	    @Param("startDate") String startDate,
    	    @Param("endDate") String endDate);



}
