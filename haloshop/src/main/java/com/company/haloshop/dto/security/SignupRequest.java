package com.company.haloshop.dto.security;

import java.util.Date;

public class SignupRequest {
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String address;
    private String addressDetail;
    private Integer zipcode;
    private Date birth;
    private String gender;

    // 기본 생성자
    public SignupRequest() {}

    // getters/setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAddressDetail() { return addressDetail; }
    public void setAddressDetail(String addressDetail) { this.addressDetail = addressDetail; }

    public Integer getZipcode() { return zipcode; }
    public void setZipcode(Integer zipcode) { this.zipcode = zipcode; }

    public Date getBirth() { return birth; }
    public void setBirth(Date birth) { this.birth = birth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
