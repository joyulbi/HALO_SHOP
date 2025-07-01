package com.company.haloshop.inquiry;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class InquiryFilterDto {
    private Long accountId;     		// 작성자 필터
    private Long entityId;      		// 관련 엔터티 필터
    private String status;      		// 상태 필터 ('SUBMITTED', 'REVIEWING', 'ANSWERED')
    private LocalDateTime startDate; 	// 조회 시작일
    private LocalDateTime endDate;    	// 조회 종료일
}
