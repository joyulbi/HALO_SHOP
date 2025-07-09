import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
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

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // ✅ 등록모드일 경우 router.query 기반 preset 값 초기화
  useEffect(() => {
    if (!isEdit) {
      const { title, description, startPrice, imageUrls } = router.query;
      if (title) setTitle(title);
      if (description) setDesc(description);
      if (startPrice) setStartPrice(startPrice);
      if (imageUrls) {
        try {
          const urls = JSON.parse(imageUrls); // ✅ 쿼리로 전달된 이미지 리스트 JSON 파싱
          setPreviews(urls);
        } catch (e) {
          console.error("imageUrls 파싱 오류", e);
        }
      }
    }
  }, [isEdit, router.query]);

  // ✅ 수정모드일 경우 DB에서 값 불러오기
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
        setExistingImages(imgs.map(img => ({ id: img.id, url: img.url })));
        setPreviews(imgs.map(img => img.url));
      });
    }
  }, [auctionId, isEdit]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

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

        for (const img of existingImages) {
          await api.delete(`/api/auction-images/${img.id}`);
        }

        if (images.length > 0) {
          const formData = new FormData();
          formData.append("auctionId", auctionId);
          images.forEach(f => formData.append("files", f));
          await api.post("/api/auction-images/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
        }
      } else {
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
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px", fontWeight: "bold", color: "#3d6fee" }}>
        {isEdit ? "경매 수정" : "경매 등록"}
      </h2>

      {/* 제목 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>제목</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
      </div>

      {/* 상세 설명 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>상세 설명</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} style={{ ...inputStyle, minHeight: "80px" }} />
      </div>

      {/* 시작가 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>시작가 (원)</label>
        <input type="number" value={startPrice} onChange={e => setStartPrice(e.target.value)} style={inputStyle} />
      </div>

      {/* 시작일 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>시작일</label>
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputStyle} />
      </div>

      {/* 종료일 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>종료일</label>
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} style={inputStyle} />
      </div>

      {/* 이미지 업로드 */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>경매 이미지 (여러개 선택 가능)</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />

        <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
          {/* 미리보기: 새 이미지 */}
          {previews.map((url, idx) => (
            <img key={idx} src={url} alt="미리보기" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px", border: "1px solid #bbb" }} />
          ))}

          {/* 미리보기: 기존 이미지 */}
          {isEdit && existingImages.map((img) => (
            <div key={img.id} style={{ position: "relative" }}>
              <img src={img.url} alt="이전 이미지" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px", border: "1px solid #bbb" }} />
              <button type="button" onClick={() => handleRemoveExistingImage(img.id)} style={{
                position: "absolute", top: "-6px", right: "-6px", background: "#f5222d",
                color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px",
                fontSize: "14px", cursor: "pointer", fontWeight: "bold", lineHeight: "20px",
                textAlign: "center", padding: 0
              }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* 제출 버튼 */}
      <button type="submit" style={{
        width: "100%",
        padding: "14px 0",
        fontWeight: "bold",
        background: "#3d6fee",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "all 0.3s"
      }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#264dbd"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3d6fee"}
      >
        {isEdit ? "수정 완료" : "등록하기"}
      </button>

      {/* 메시지 */}
      {msg && <div style={{ color: msg.includes("실패") ? "red" : "green", marginTop: "16px", textAlign: "center", fontWeight: "bold" }}>{msg}</div>}
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "15px"
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "8px",
  fontSize: "15px"
};
