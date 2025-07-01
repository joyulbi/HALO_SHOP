import React from "react";

export default function AuctionLog({
  logs, highest, inputBid, setInputBid, handleBid, isFinished
}) {
  return (
    <div style={{
      flex: 3, background: "#f0f3ff", minHeight: 120, padding: 18,
      border: "2px solid #3366ff", borderRadius: 8, display: "flex",
      flexDirection: "column", justifyContent: "space-between"
    }}>
      <div>
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>경매 로그 실시간 정보</div>
        {logs.length > 0 ? logs.map((log, i) => (
          <div key={i}>{log.accountId}님이 {log.price}원에 입찰</div>
        )) : <div>입찰 로그 없음</div>}
      </div>
      <div style={{
        marginTop: 12, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          width: "90%", marginBottom: 10, background: "#111", color: "#fff",
          fontWeight: "bold", fontSize: "1.3rem", textAlign: "center", padding: 6, borderRadius: 5
        }}>
          최고 입찰가 {highest}
        </div>
        <input type="number" placeholder="입찰가 입력"
          value={inputBid}
          disabled={isFinished}
          onChange={e => setInputBid(e.target.value)}
          style={{
            width: "90%", fontSize: "1.2rem", marginBottom: 10, padding: 8,
            border: "1px solid #ccc", borderRadius: 4
          }} />
        <button style={{
          width: "90%", padding: "10px 0", background: "#ff2222", color: "#fff",
          fontWeight: "bold", border: "none", borderRadius: 5, fontSize: "1.1rem"
        }} onClick={handleBid} disabled={isFinished}>입찰하기</button>
        {isFinished && <div style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>경매가 종료되었습니다.</div>}
      </div>
    </div>
  );
}
