package com.company.haloshop.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateRequest {
 private Long accountId;

 // Account 테이블
 private String nickname;
 private String email;
 private String phone;

 // Admin 테이블
 private Integer role;
 private String position;
 private String intro;
 private String status;
}
