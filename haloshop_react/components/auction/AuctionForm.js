import React, { useState } from "react";
import api from '../../utils/axios';
import { useRouter } from "next/router";

export default function AuctionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [msg, setMsg] = useState("");

  const toSecond = (s) => s.length === 16 ? s + ":00" : s;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!title || !startPrice || !startTime || !endTime) {
      setMsg("제목, 시작가, 시작일, 종료일은 필수입니다.");
      return;
    }
    try {
      const auctionRes = await api.post("/api/auctions", {
        title,
        description: desc,
        startPrice: Number(startPrice),
        startTime: toSecond(startTime),
        endTime: toSecond(endTime),
        status: "READY", // ← 필수! (DDL default를 보장 못하는 MyBatis insert 구조 대비)
      });
    console.log("등록 결과:", auctionRes.data);
    const auctionId = auctionRes.data.id;
    console.log("auctionId:", auctionId);

      if (imageUrl) {
        await api.post("/api/auction-images", {
          auctionId,
          url: imageUrl,
        });
      }
      setMsg("경매 등록 완료!");
      setTimeout(() => router.push(`/auction/${auctionId}`), 900);
    } catch (err) {
      setMsg("등록 실패: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <label>제목</label><br />
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>상세 설명</label><br />
        <textarea value={desc} onChange={e => setDesc(e.target.value)}
          style={{ width: "100%", minHeight: 56, padding: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>시작가(원)</label><br />
        <input type="number" value={startPrice} onChange={e => setStartPrice(e.target.value)}
          style={{ width: "100%", padding: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>시작일 (YYYY-MM-DD HH:mm)</label><br />
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
          style={{ width: "100%", padding: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>종료일 (YYYY-MM-DD HH:mm)</label><br />
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}
          style={{ width: "100%", padding: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>대표 이미지 URL</label><br />
        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
          style={{ width: "100%", padding: 8 }} placeholder="https://..." />
      </div>
      <button type="submit" style={{ width: "100%", padding: 12, fontWeight: "bold", background: "#3d6fee", color: "#fff", border: "none", borderRadius: 8 }}>등록하기</button>
      {msg && <div style={{ color: msg.includes("실패") ? "red" : "green", marginTop: 14, textAlign: "center" }}>{msg}</div>}
    </form>
  );
}
