import { useAuth } from "../../hooks/useAuth";
import React, { useEffect, useRef } from "react";

export default function AuctionLog({
  logs, highest, inputBid, setInputBid, handleBid, isFinished, minBid, errorMsg, accountMap
}) {
  const { user } = useAuth();
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [logs]);

  return (
    <div style={{
      background: "#f6f6f6", // 🔥 톤 맞춤
      border: "1px solid #ddd", // 🔥 통일
      borderRadius: 12,
      padding: 18,
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch"
    }}>
      {/* 입찰 로그 */}
      <div style={{
        flex: 2,
        marginRight: 18,
        overflowY: "auto",
        maxHeight: "300px",
        paddingRight: 8,
        position: "relative"
      }}>
        <div style={{ fontWeight: "bold", marginBottom: 8, fontSize: "1.05rem" }}>입찰 기록</div>
        {logs.length > 0 ? logs.map((log, i) => (
          <div key={i} style={{ marginBottom: 5, fontSize: "0.95rem" }}>
            {user && log.accountId === user.id
              ? <b style={{ color: "#4a9fff" }}>{user.nickname}님</b>
              : `${accountMap && accountMap[log.accountId] ? accountMap[log.accountId] : log.accountId}님`
            }이 {log.price.toLocaleString()}원에 입찰
          </div>
        )) : <div style={{ fontSize: "0.95rem" }}>입찰 로그 없음</div>}
        <div ref={logEndRef} />
      </div>

      {/* 입찰 폼 */}
      <div style={{
        flex: 1,
        background: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 180,
        padding: 16
      }}>
        <div style={{
          width: "90%",
          marginBottom: 10,
          background: "#4a9fff",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem",
          textAlign: "center",
          padding: 6,
          borderRadius: 6
        }}>
          최고 입찰가 {highest ? highest.toLocaleString() : "-"}
        </div>
        <input
          type="number"
          placeholder={`최소 ${minBid || 0}원, 100원 단위`}
          value={inputBid}
          disabled={isFinished}
          min={minBid}
          step={100}
          onChange={e => setInputBid(e.target.value)}
          style={{
            width: "90%",
            fontSize: "1rem",
            marginBottom: 10,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4
          }}
        />
        <button
          style={{
            width: "90%",
            padding: "8px 0",
            background: "#ff5555",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: 5,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s"
          }}
          onClick={handleBid}
          disabled={isFinished}
        >
          입찰하기
        </button>
        {isFinished && <div style={{ color: "#d00", marginTop: 10, fontWeight: "bold" }}>경매가 종료되었습니다.</div>}
        {errorMsg && <div style={{ color: "#d00", marginTop: 10 }}>{errorMsg}</div>}
        <div style={{ fontSize: "0.9rem", marginTop: 8, color: "#555", textAlign: "center" }}>
          최소 입찰 가능 금액: <b>{minBid ? minBid.toLocaleString() : "-"}</b>원<br />100원 단위만 가능
        </div>
      </div>
    </div>
  );
}
