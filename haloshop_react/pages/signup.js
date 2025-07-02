import React, { useState } from "react";
import axios from "axios"; // axios 임포트

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    phone: "",
    address: "",
    addressDetail: "",
    zipcode: "",
    birth: "", // ISO 8601 형식 문자열로 저장될 예정
    gender: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태 추가

  // 백엔드 API의 기본 URL (application.properties/yml에 설정된 포트 확인)
  const API_BASE_URL = "http://localhost:8080"; // ✅ 백엔드 서버 URL에 맞게 수정해주세요

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(""); // 메시지 초기화
    setError("");   // 에러 초기화

    // 폼 데이터 준비
    const signupData = {
      ...formData,
      // birth 필드를 ISO 8601 형식의 Date 객체 문자열로 변환
      // input type="date"는 YYYY-MM-DD 형식의 문자열을 반환.
      // 이를 Date 객체로 변환 후 toISOString()으로 백엔드 Date 타입에 맞춥니다.
      birth: formData.birth ? new Date(formData.birth).toISOString() : null,
      // zipcode는 number 타입으로 잘 변환되지만, 확실하게 정수로 파싱 (선택사항)
      zipcode: formData.zipcode ? parseInt(formData.zipcode, 10) : null,
    };

    try {
      // axios를 사용하여 POST 요청 전송
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 응답 상태가 2xx인 경우 성공으로 간주
      if (res.status === 200) {
        setMessage("회원가입 성공! 이제 로그인 해주세요.");
        // 폼 초기화
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
        // ✅ 성공 시 로그인 페이지로 리다이렉션 (Next.js router 사용)
        // useRouter 훅을 임포트해서 사용해야 합니다:
        // import { useRouter } from 'next/router';
        // const router = useRouter();
        // router.push('/login'); // /login 경로로 이동
      } else {
        // 백엔드에서 2xx가 아닌 상태 코드를 반환하더라도 에러가 아닌 메시지를 보내는 경우
        // 여기서는 axios가 2xx가 아니면 throw error하므로 이 블록은 작동 안함
        setMessage("회원가입 실패: 알 수 없는 응답");
      }
    } catch (err) {
      // axios는 2xx가 아닌 응답(4xx, 5xx)을 받으면 catch 블록으로 에러를 던집니다.
      if (err.response) {
        // 서버가 응답을 보냈고, 그 응답이 2xx 범위 밖인 경우
        // 백엔드에서 메시지를 Plain text로 보냈다면 err.response.data에 그대로 들어있음
        setError("회원가입 실패: " + err.response.data);
      } else if (err.request) {
        // 요청이 전송되었지만 응답을 받지 못한 경우 (네트워크 문제)
        setError("네트워크 오류: 서버에 연결할 수 없습니다.");
      } else {
        // 요청 설정 중 문제 발생
        setError("오류 발생: " + err.message);
      }
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
          type="number" // type="number" 사용
          name="zipcode"
          placeholder="우편번호"
          value={formData.zipcode}
          onChange={handleChange}
          required
        /><br />
        <input
          type="date" // type="date" 사용
          name="birth"
          placeholder="생년월일"
          value={formData.birth} // YYYY-MM-DD 형식으로 유지 (display용)
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
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}