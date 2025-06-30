package com.company.haloshop.inquiry;

import lombok.Data;

@Data
public class InquiryRequestDto {
    private Long accountId;
    private Long entityId;
    private String title;
    private String content;
    private String file;
}
