package com.company.haloshop.inquiryanswer;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class InquiryAnswerDto {
    private Long inquiryId;
    private String answer;
    private Long accountId;
    private LocalDateTime createdAt;
}
