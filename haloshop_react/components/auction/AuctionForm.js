import React, { useEffect, useState } from "react";
import api from '../../utils/axios';
import { useRouter } from "next/router";

export default function AuctionForm() {
  const router = useRouter();
  const auctionId = router.query.id;
  const isEdit = !!auctionId;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [msg, setMsg] = useState("");

  const [prevImage, setPrevImage] = useState(null); // 이전 이미지 정보 저장

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/auctions/${auctionId}`).then(res => {
        const data = res.data;
        setTitle(data.title || "");
        setDesc(data.description || "");
        setStartPrice(data.startPrice || "");
        setStartTime(data.startTime?.slice(0, 16) || "");
        setEndTime(data.endTime?.slice(0, 16) || "");
      });

      api.get(`/api/auction-images/auction/${auctionId}`).then(imgRes => {
        const imgs = Array.isArray(imgRes.data) ? imgRes.data : [imgRes.data];
        const img = imgs[0];
        if (img) {
          setImageUrl(img.url || "");
          setPrevImage({ id: img.id, url: img.url });
        }
      });
    }
  }, [auctionId]);

  const toSecond = (s) => s.length === 16 ? s + ":00" : s;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!title || !startPrice || !startTime || !endTime) {
      setMsg("제목, 시작가, 시작일, 종료일은 필수입니다.");
      return;
    }

    try {
      const payload = {
        title,
        description: desc,
        startPrice: Number(startPrice),
        startTime: toSecond(startTime),
        endTime: toSecond(endTime),
        status: "READY",
      };

      let id = auctionId;

      if (isEdit) {
        await api.put(`/api/auctions/${auctionId}`, payload);

        // 이미지 수정 로직
        if (prevImage && prevImage.url !== imageUrl) {
          await api.delete(`/api/auction-images/${prevImage.id}`);
          if (imageUrl) {
            await api.post(`/api/auction-images`, {
              auctionId,
              url: imageUrl
            });
          }
        }

      } else {
        const res = await api.post("/api/auctions", payload);
        id = res.data.id;

        if (imageUrl) {
          await api.post(`/api/auction-images`, {
            auctionId: id,
            url: imageUrl
          });
        }
      }

      setMsg("저장 완료!");
      setTimeout(() => router.push(`/auction/${id}`), 1000);
    } catch (err) {
      setMsg("실패: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>{isEdit ? "경매 수정" : "경매 등록"}</h3>

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
        <label>시작일</label><br />
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
          style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>종료일</label><br />
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}
          style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>대표 이미지 URL</label><br />
        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
          style={{ width: "100%", padding: 8 }} />
      </div>

      <button type="submit" style={{
        width: "100%", padding: 12, fontWeight: "bold", background: "#3d6fee",
        color: "#fff", border: "none", borderRadius: 8
      }}>{isEdit ? "수정 완료" : "등록하기"}</button>

      {msg && <div style={{ color: msg.includes("실패") ? "red" : "green", marginTop: 14, textAlign: "center" }}>{msg}</div>}
    </form>
  );
}
