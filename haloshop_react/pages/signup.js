import React, { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    phone: "",
    address: "",
    addressDetail: "",
    zipcode: "",
    birth: "",
    gender: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        setMessage("회원가입 실패: " + errMsg);
        return;
      }

      setMessage("회원가입 성공! 로그인 해주세요.");
      setFormData({
        email: "",
        password: "",
        nickname: "",
        phone: "",
        address: "",
        addressDetail: "",
        zipcode: "",
        birth: "",
        gender: "",
      });
    } catch (error) {
      setMessage("네트워크 오류: " + error.message);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="phone"
          placeholder="전화번호"
          value={formData.phone}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="address"
          placeholder="주소"
          value={formData.address}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="addressDetail"
          placeholder="상세주소"
          value={formData.addressDetail}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          name="zipcode"
          placeholder="우편번호"
          value={formData.zipcode}
          onChange={handleChange}
          required
        /><br />
        <input
          type="date"
          name="birth"
          placeholder="생년월일"
          value={formData.birth}
          onChange={handleChange}
          required
        /><br />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">성별 선택</option>
          <option value="M">남자</option>
          <option value="F">여자</option>
        </select><br />
        <button type="submit">회원가입</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
