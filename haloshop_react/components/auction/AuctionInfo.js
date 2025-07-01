import React from "react";

export default function AuctionInfo({ images, title, desc, status }) {
  return (
    <div style={{ flex: 3, display: "flex", gap: 24 }}>
      <div style={{
        flex: 1, minWidth: 240, background: "#fff", height: 320,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "2px solid #ccc"
      }}>
        {images.length > 0 ? (
          <img src={images[0].url} alt="경매이미지" style={{ maxWidth: "100%", maxHeight: "90%" }} />
        ) : "이미지 자리"}
      </div>
      <div style={{
        flex: 1, minWidth: 240, background: "#fff", height: 320,
        border: "2px solid #ccc", padding: 24
      }}>
        <h2 style={{ marginTop: 0 }}>{title || "경매 제목"}</h2>
        <p>{desc || "경매 상세 정보"}</p>
        <div style={{ marginTop: 12, fontWeight: "bold" }}>
          {status === "FINISHED" ? "경매 종료" : status === "ONGOING" ? "진행 중" : status}
        </div>
      </div>
    </div>
  );
}
