import React from "react";
import AuctionForm from "../../components/auction/AuctionForm";

export default function AuctionNewPage() {
  return (
    <div style={{
      maxWidth: 800,
      margin: "80px auto",
      background: "#f9fafd",
      padding: "50px 60px",
      borderRadius: "16px",
      border: "1px solid #ddd",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
    }}>

      <div style={{
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <AuctionForm />
      </div>
    </div>
  );
}
