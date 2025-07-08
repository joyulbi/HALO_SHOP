package com.company.haloshop.inquiry;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class InquiryDto {
    private Long id;
    private Long accountId;
    private String accountEmail;   // 이메일 추가
    private String accountNickname; // 닉네임 추가
    private Long entityId;
    private String entityName;
    private String title;
    private String content;
    private String file;
    private LocalDateTime createdAt;
    private String status;
}