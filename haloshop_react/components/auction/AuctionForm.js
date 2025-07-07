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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [msg, setMsg] = useState("");

  // 이미지 업로드 전용 state
  const [images, setImages] = useState([]);         // File[] 타입
  const [previews, setPreviews] = useState([]);     // 미리보기용 URL 배열
  const [existingImages, setExistingImages] = useState([]); // 수정 시 기존 이미지 id 저장

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
      // 기존 이미지 가져오기
      api.get(`/api/auction-images/auction/${auctionId}`).then(imgRes => {
        const imgs = Array.isArray(imgRes.data) ? imgRes.data : [imgRes.data];
        setExistingImages(imgs.map(img => ({ id: img.id, url: img.url })));
        setPreviews(imgs.map(img => img.url));
      });
    }
  }, [auctionId, isEdit]);

  // 이미지 파일 변경 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  // 기존 이미지 삭제 (수정 시)
  const handleRemoveExistingImage = (id) => {
    setExistingImages(existingImages.filter(img => img.id !== id));
  };

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

        // 기존 이미지가 남아 있으면 삭제(이 예시는 모두 삭제)
        for (const img of existingImages) {
          await api.delete(`/api/auction-images/${img.id}`);
        }
        // 새 이미지 업로드
        if (images.length > 0) {
          const formData = new FormData();
          formData.append("auctionId", auctionId);
          images.forEach(f => formData.append("files", f));
          await api.post("/api/auction-images/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        }

      } else {
        // 등록
        const res = await api.post("/api/auctions", payload);
        id = res.data.id;
        if (images.length > 0) {
          const formData = new FormData();
          formData.append("auctionId", id);
          images.forEach(f => formData.append("files", f));
          await api.post("/api/auction-images/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
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
        <label>경매 이미지 (여러개 선택 가능)</label><br />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ width: "100%", padding: 8 }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {/* 미리보기: 새 이미지 */}
          {previews.map((url, idx) =>
            <img key={idx} src={url} alt="미리보기" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #bbb" }} />
          )}
          {/* 미리보기: 기존 이미지(수정시) */}
          {isEdit && existingImages.map((img, idx) =>
            <div key={img.id} style={{ position: "relative" }}>
              <img src={img.url} alt="이전이미지" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #bbb" }} />
              <button type="button" onClick={() => handleRemoveExistingImage(img.id)}
                style={{
                  position: "absolute", top: 0, right: 0, background: "#e44", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 14, cursor: "pointer"
                }}>×</button>
            </div>
          )}
        </div>
      </div>

      <button type="submit" style={{
        width: "100%", padding: 12, fontWeight: "bold", background: "#3d6fee",
        color: "#fff", border: "none", borderRadius: 8
      }}>{isEdit ? "수정 완료" : "등록하기"}</button>

      {msg && <div style={{ color: msg.includes("실패") ? "red" : "green", marginTop: 14, textAlign: "center" }}>{msg}</div>}
    </form>
  );
}
