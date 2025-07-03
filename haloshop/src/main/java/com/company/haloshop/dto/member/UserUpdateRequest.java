package com.company.haloshop.dto.member;

public class UserUpdateRequest {
    private String nickname;
    private String email;            // ★ 추가: 이메일
    private String address;
    private String addressDetail;
    private String zipcode;
    private String birth;
    private String gender;

    // getter/setter
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getAddressDetail() { return addressDetail; }
    public void setAddressDetail(String addressDetail) { this.addressDetail = addressDetail; }
    public String getZipcode() { return zipcode; }
    public void setZipcode(String zipcode) { this.zipcode = zipcode; }
    public String getBirth() { return birth; }
    public void setBirth(String birth) { this.birth = birth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
