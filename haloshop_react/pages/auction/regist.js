import React from "react";
import AuctionForm from "../../components/auction/AuctionForm";

export default function AuctionNewPage() {
  return (
    <div style={{
      maxWidth: 480, margin: "60px auto",
      background: "#fff", padding: 36, borderRadius: 16, border: "2px solid #d3d9ee"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>경매 등록</h2>
      <AuctionForm />
    </div>
  );
}
