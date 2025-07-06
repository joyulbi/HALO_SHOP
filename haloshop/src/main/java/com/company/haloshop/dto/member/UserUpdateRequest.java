package com.company.haloshop.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String nickname;
    private String email;            // ★ 추가: 이메일
    private String phone;
    private String address;
    private String addressDetail;
    private String zipcode;
    private String birth;
    private String gender;

}
