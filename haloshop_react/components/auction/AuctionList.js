import React from "react";
import Link from "next/link";

const BACKEND_URL = "http://localhost:8080";

export default function AuctionList({ auction, imageUrl, onDelete }) {
  // imageUrl이 http로 시작하면 그대로, 아니면 백엔드 주소 붙이기
  const resolvedUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : BACKEND_URL + imageUrl
    : null;

  return (
    <tr style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ textAlign: "center", padding: 8 }}>
        {resolvedUrl
          ? <img src={resolvedUrl} alt="img" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }} />
          : <div style={{ width: 60, height: 60, background: "#eee", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>-</div>}
      </td>
      <td style={{ padding: 8 }}>{auction.title}</td>
      <td style={{ padding: 8 }}>
        {auction.status === "FINISHED"
          ? "경매 종료"
          : auction.status === "ONGOING"
            ? "진행 중"
            : auction.status === "READY"
              ? "준비 중"
              : auction.status === "CANCELED"
                ? "취소됨"
                : auction.status}
      </td>
      <td style={{ padding: 8 }}>{auction.startPrice?.toLocaleString() || "-"}</td>
      <td style={{ padding: 8, display: "flex", gap: 8 }}>
        <Link href={`/auction/${auction.id}`}>
          <button style={buttonStyle("#377be6")}>상세</button>
        </Link>
        <Link href={`/auction/regist?id=${auction.id}`}>
          <button style={buttonStyle("#ffaa00")}>수정</button>
        </Link>
        <button style={buttonStyle("#e64444")} onClick={() => onDelete(auction.id)}>삭제</button>
      </td>
    </tr>
  );
}

const buttonStyle = (bg) => ({
  background: bg, color: "#fff", border: "none",
  borderRadius: 5, padding: "5px 10px", fontWeight: "bold"
});
