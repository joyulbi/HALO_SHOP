import React from "react";
import Link from "next/link";

const BACKEND_URL = "http://localhost:8080";

export default function AuctionList({ auction, imageUrl, onDelete }) {
  const resolvedUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : BACKEND_URL + imageUrl
    : null;

  const isAdmin = !!onDelete;
  const isReady = auction.status === "READY";

  return (
    <tr style={{ borderBottom: "1px solid #eee", height: "80px", textAlign: "center" }}>
      <td style={{ padding: "12px" }}>
        {resolvedUrl ? (
          <img
            src={resolvedUrl}
            alt="img"
            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
          />
        ) : (
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "#eee",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            없음
          </div>
        )}
      </td>

      <td style={{ padding: "12px", fontSize: "16px" }}>{auction.title}</td>

      <td style={{ padding: "12px", fontSize: "14px", fontWeight: "bold" }}>
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

      <td style={{ padding: "12px", fontSize: "15px", color: "#1890ff", fontWeight: "bold" }}>
        {auction.startPrice?.toLocaleString() || "-"}
      </td>

      <td style={{ padding: "12px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <Link href={`/auction/${auction.id}`}>
            <button
              style={buttonStyle("#3d6fee")}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#264dbd"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3d6fee"}
            >
              상세
            </button>
          </Link>

          {isAdmin && isReady && (
            <Link href={`/auction/regist?id=${auction.id}`}>
              <button
                style={buttonStyle("#ffaa00")}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#d48806"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ffaa00"}
              >
                수정
              </button>
            </Link>
          )}

          {isAdmin && (
            <button
              style={buttonStyle("#f5222d")}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#cf1322"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f5222d"}
              onClick={() => onDelete(auction.id)}
            >
              삭제
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

const buttonStyle = (bg) => ({
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "8px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "all 0.3s"
});
