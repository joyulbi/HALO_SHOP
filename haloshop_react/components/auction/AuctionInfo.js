import React from "react";

const BACKEND_URL = "http://localhost:8080";

export default function AuctionInfo({ images, title, desc, status }) {
  return (
    <div style={{
      background: "#fff", border: "4px solid #b0c7f8", borderRadius: 12, padding: 28, display: "flex",
      flex: 1, minWidth: 180, alignItems: "center", justifyContent: "center"
    }}>
      {/* 이미지 */}
      <div style={{
        flex: 1, minWidth: 180, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {images.length > 0 ? (
          <img
            src={
              images[0].url
                ? images[0].url.startsWith("http")
                  ? images[0].url
                  : BACKEND_URL + images[0].url
                : ""
            }
            alt="경매이미지"
            style={{ maxHeight: 220, maxWidth: 180 }}
          />
        ) : "이미지 자리"}
      </div>
      {/* 상세정보 */}
      <div style={{ flex: 1, minWidth: 180, marginLeft: 28 }}>
        <div style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 8 }}>{title || "경매 제목"}</div>
        <div>{desc || "경매 상세 정보"}</div>
        <div style={{ marginTop: 14, fontWeight: "bold" }}>
          {status === "READY"    ? "준비 중"
           : status === "ONGOING" ? "진행 중"
           : status === "FINISHED"? "경매 종료"
           : status === "CANCELED"? "취소됨"
           : status}
        </div>
      </div>
    </div>
  );
}
