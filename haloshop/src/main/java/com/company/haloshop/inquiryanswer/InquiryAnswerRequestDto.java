package com.company.haloshop.inquiryanswer;

import lombok.Data;

@Data
public class InquiryAnswerRequestDto {
    private Long inquiryId;
    private String answer;
    private Long accountId;
}