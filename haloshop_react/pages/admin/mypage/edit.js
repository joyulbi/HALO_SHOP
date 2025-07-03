// pages/admin/mypage/edit.js

import React, { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { useRouter } from "next/router";

const AdminMyPageEdit = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    nickname: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // 관리자 내정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/me");
        setForm({
          nickname: res.data?.account?.nickname ?? "",
          email: res.data?.account?.email ?? "",
        });
      } catch {
        setMsg("관리자 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 폼 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.patch("/admin/me", {
        nickname: form.nickname,
        email: form.email,
      });
      setMsg("수정 완료!");
      setTimeout(() => {
        router.push("/mypage");
      }, 1000);
    } catch (err) {
      setMsg("수정 실패: " + (err?.response?.data || "오류"));
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ maxWidth: 420, margin: "auto", padding: "36px 0" }}>
      <h2 style={{ marginBottom: 24 }}>관리자 내 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label>
            닉네임: <br />
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            이메일: <br />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <button type="submit">수정하기</button>
        <button type="button" style={{ marginLeft: 12 }} onClick={() => router.back()}>
          취소
        </button>
      </form>
      {msg && <p style={{ color: msg.includes("실패") ? "crimson" : "green" }}>{msg}</p>}
    </div>
  );
};

export default AdminMyPageEdit;
