import React from "react";

export default function AuctionChat({
  chat, inputMsg, setInputMsg, handleChat, isFinished
}) {
  return (
    <div style={{
      background: "#e6f0ff", border: "4px solid #5c87e6",
      borderRadius: 14, minHeight: 520, display: "flex", flexDirection: "column"
    }}>
      {/* 채팅 목록 */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {chat.map((c, i) => (
          <div key={i} style={{
            marginBottom: 7, background: "#dabfff", padding: "6px 12px", borderRadius: 8
          }}>
            <b>{c.sender}:</b> {c.content}
          </div>
        ))}
      </div>

      {/* 채팅 입력창 */}
      <div style={{
        borderTop: "1px solid #bbb", display: "flex", flexDirection: "column", gap: 6,
        padding: 10, background: "#f4f8fd"
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            style={{ flex: 1, fontSize: "1.1rem", padding: 8, borderRadius: 6 }}
            placeholder="메시지 입력"
            value={inputMsg}
            disabled={isFinished}
            onChange={e => setInputMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleChat()}
          />
          <button
            style={{
              width: 60, borderRadius: 6, background: "#377be6", color: "#fff"
            }}
            disabled={isFinished}
            onClick={handleChat}
          >보내기</button>
        </div>
        {isFinished && (
          <div style={{ color: "#d00", fontWeight: "bold", fontSize: "0.95rem", paddingTop: 6 }}>
            ⚠️ 경매가 종료되어 채팅이 비활성화되었습니다.
          </div>
        )}
      </div>
    </div>
  );
}
