import React, { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/router";

const AdminMyPageEdit = () => {
  const { user, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    phone: "",
  });
  const [msg, setMsg] = useState("");

  // 쿠키에서 CSRF 토큰 가져오는 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // 관리자 권한 체크
  useEffect(() => {
    if (!user) {
      return;
    }
    if (!user.isAdmin) {
      router.replace("/mypage");
      return;
    }
    setForm({
      nickname: user.nickname || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      // CSRF 토큰 가져오기
      const csrfToken = getCookie("XSRF-TOKEN"); // 정확한 토큰 이름
      if (!csrfToken) {
        setMsg("CSRF 토큰을 찾을 수 없습니다.");
        return;
      }

      console.log("Sending form data:", form);
      console.log("CSRF Token:", csrfToken);

      const res = await api.post(
        "/admin/update", // 요청할 API 경로
        form, // 보낼 폼 데이터
        {
          withCredentials: true, // 세션 쿠키를 포함하여 요청 보냄
          headers: {
            "XSRF-TOKEN": csrfToken, // 정확한 헤더 이름으로 변경
            "Content-Type": "application/json", // 요청 타입을 JSON으로 설정
          },
        }
      );
      setMsg("수정 완료!");
      setTimeout(() => {
        router.push("/mypage");
      }, 1000);
    } catch (err) {
      console.error("Error:", err);
      setMsg(
        "수정 실패: " +
          (err?.response?.data?.error || err.message || "알 수 없는 오류")
      );
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ maxWidth: 420, margin: "auto", padding: "36px 0" }}>
      <h2 style={{ marginBottom: 24 }}>관리자 내 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: "닉네임", name: "nickname", type: "text" },
          { label: "이메일", name: "email", type: "email" },
          { label: "전화번호", name: "phone", type: "text" },
        ].map(({ label, name, type }) => (
          <div style={{ marginBottom: 18 }} key={name}>
            <label>
              {label}: <br />
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                type={type}
                style={{ width: "100%" }}
              />
            </label>
          </div>
        ))}

        <button type="submit">수정하기</button>
        <button
          type="button"
          style={{ marginLeft: 12 }}
          onClick={() => router.back()}
        >
          취소
        </button>
      </form>
      {msg && (
        <p style={{ color: msg.includes("실패") ? "crimson" : "green" }}>
          {msg}
        </p>
      )}
    </div>
  );
};

export default AdminMyPageEdit;
