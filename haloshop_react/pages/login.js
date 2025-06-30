import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        setMessage("로그인 실패: " + errMsg);
        return;
      }

      const data = await res.json();
      console.log("로그인 성공, 토큰:", data);
      setMessage("로그인 성공!");

      // 예) 로컬스토리지에 토큰 저장
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (error) {
      setMessage("네트워크 오류: " + error.message);
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">로그인</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
