import React from "react";
import MyAuctionResultManager from "../../components/auction/MyAuctionResultManager";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AuctionResultPage() {
  return (
    <>
      <Header />
      <div style={{
        maxWidth: 800,
        margin: "60px auto 80px",
        minHeight: 480,
        padding: "40px 20px",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ marginBottom: 28, fontWeight: 700, fontSize: 26, letterSpacing: -1 }}>
          내 낙찰 결과 관리
        </h2>
        <MyAuctionResultManager />
      </div>
      <Footer />
    </>
  );
}
