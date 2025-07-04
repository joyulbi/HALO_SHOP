import React, { useEffect, useState } from "react";
import api from '../../utils/axios';
import AuctionList from "../../components/auction/AuctionList";
import Link from "next/link";

export default function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [images, setImages] = useState({});

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
    <div style={{
      maxWidth: 900, margin: "40px auto", background: "#f9fafd",
      borderRadius: 16, border: "2px solid #ddd", padding: 36
    }}>
      <h2>경매 목록</h2>
      <Link href="/auction/regist">
        <button style={{
          float: "right", marginBottom: 16, background: "#3d6fee", color: "#fff",
          padding: "8px 18px", border: "none", borderRadius: 6
        }}>+ 새 경매 등록</button>
      </Link>
      <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#dde6fb" }}>
            <th style={{ padding: 8 }}>이미지</th>
            <th style={{ padding: 8 }}>제목</th>
            <th style={{ padding: 8 }}>상태</th>
            <th style={{ padding: 8 }}>시작가</th>
            <th style={{ padding: 8 }}>동작</th>
          </tr>
        </thead>
        <tbody>
          {auctions.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#888" }}>경매가 없습니다.</td></tr>}
          {auctions.map(auction => (
            <AuctionList
              key={auction.id}
              auction={auction}
              imageUrl={images[auction.id]}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
