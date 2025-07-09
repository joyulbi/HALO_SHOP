import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
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
  const [error, setError] = useState("");
  const API_BASE_URL = "http://localhost:8080";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const signupData = {
      ...formData,
      birth: formData.birth ? new Date(formData.birth).toISOString() : null,
      zipcode: formData.zipcode ? parseInt(formData.zipcode, 10) : null,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, signupData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        setMessage("🎉 회원가입 성공! 로그인으로 이동합니다.");
        setTimeout(() => router.push("/login"), 1800);
      }
    } catch (err) {
      if (err.response) {
        setError("회원가입 실패: " + err.response.data);
      } else if (err.request) {
        setError("네트워크 오류: 서버에 연결할 수 없습니다.");
      } else {
        setError("오류 발생: " + err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎈 Welcome to Halo Shop</h2>
      <p style={styles.subtitle}>회원 정보를 입력해주세요</p>

      <form onSubmit={handleSignup} style={styles.form}>
        <div style={styles.group}>
          <label style={styles.label}>이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.groupRow}>
          <div style={styles.group}>
            <label style={styles.label}>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>전화번호</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>주소</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.groupRow}>
          <div style={styles.group}>
            <label style={styles.label}>상세주소</label>
            <input
              type="text"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>우편번호</label>
            <input
              type="number"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.groupRow}>
          <div style={styles.group}>
            <label style={styles.label}>생년월일</label>
            <input
              type="date"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>성별</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">성별 선택</option>
              <option value="M">남자</option>
              <option value="F">여자</option>
            </select>
          </div>
        </div>

        <button type="submit" style={styles.button}>회원가입 완료</button>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "680px",
    margin: "60px auto",
    padding: "48px 40px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
    fontFamily: "'Noto Sans KR', sans-serif",
    transition: "all 0.3s ease",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "4px",
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "15px",
    marginBottom: "30px",
    color: "#777",
    letterSpacing: "-0.2px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  group: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  groupRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  label: {
    marginBottom: "8px",
    fontWeight: 500,
    fontSize: "14px",
    color: "#333",
    letterSpacing: "-0.3px",
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #d1d1d1",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#f9f9f9",
  },
  inputFocus: {
    borderColor: "#c8102e",
    backgroundColor: "#fff",
    boxShadow: "0 0 0 3px rgba(200, 16, 46, 0.1)",
  },
  button: {
    marginTop: "32px",
    padding: "14px",
    backgroundColor: "#c8102e",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
  },
  buttonHover: {
    backgroundColor: "#a50c26",
    transform: "translateY(-1px)",
    boxShadow: "0 10px 16px rgba(0,0,0,0.1)",
  },
  success: {
    color: "green",
    marginTop: "24px",
    textAlign: "center",
    fontWeight: "500",
  },
  error: {
    color: "red",
    marginTop: "24px",
    textAlign: "center",
    fontWeight: "500",
  },
};
