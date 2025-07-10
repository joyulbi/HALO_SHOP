import React, { useEffect, useState } from "react";
import api from '../../utils/axios';
import AuctionList from "../../components/auction/AuctionList";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

export default function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [images, setImages] = useState({});
  const { user } = useAuth();

  const loadAuctions = () => {
    api.get("/api/auctions")
      .then(res => setAuctions(res.data))
      .catch(() => setAuctions([]));
  };

  useEffect(() => {
    loadAuctions();
  }, []);

  useEffect(() => {
    if (auctions.length > 0) {
      auctions.forEach(auction => {
        api.get(`/api/auction-images/auction/${auction.id}`)
          .then(res => {
            const arr = Array.isArray(res.data) ? res.data : [res.data];
            setImages(prev => ({ ...prev, [auction.id]: arr[0]?.url }));
          });
      });
    }
  }, [auctions]);

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/auctions/${id}`);
      alert("삭제되었습니다.");
      loadAuctions();
    } catch (e) {
      alert("삭제 실패: " + (e?.response?.data?.message || e.message));
    }
  };

  return (
    <div style={{ maxWidth: 1600, margin: "80px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>경매 목록</h1>
        {user?.admin && (
          <Link href="/auction/regist">
            <button style={{
              background: "#3d6fee",
              color: "#fff",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.3s"
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#264dbd"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3d6fee"}
            >
              + 새 경매 등록
            </button>
          </Link>
        )}
      </div>

      <div style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        overflowX: "auto"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f7fa", height: "50px", textAlign: "center", fontSize: "16px" }}>
              <th style={{ padding: "12px" }}>이미지</th>
              <th style={{ padding: "12px" }}>제목</th>
              <th style={{ padding: "12px" }}>상태</th>
              <th style={{ padding: "12px" }}>시작가</th>
              <th style={{ padding: "12px" }}>동작</th>
            </tr>
          </thead>
          <tbody>
            {auctions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "#888" }}>경매가 없습니다.</td>
              </tr>
            )}
            {auctions.map(auction => (
              <AuctionList
                key={auction.id}
                auction={auction}
                imageUrl={images[auction.id]}
                onDelete={user?.admin ? handleDelete : undefined}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
