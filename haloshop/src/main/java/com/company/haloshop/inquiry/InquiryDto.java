package com.company.haloshop.inquiry;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class InquiryDto {
    private Long id;
    private Long accountId;
    private Long entityId;
    private String title;
    private String content;
    private String file;
    private LocalDateTime createdAt;
    private String status;
}