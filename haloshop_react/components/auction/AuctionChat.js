// /components/auction/AuctionChat.js
import React from "react";

export default function AuctionChat({
  chat, inputMsg, setInputMsg, handleChat, isFinished
}) {
  return (
    <div style={{
      flex: 2, background: "#e6f0ff", minWidth: 320, height: 420,
      border: "2px solid #9cc2ff", borderRadius: 10, display: "flex", flexDirection: "column"
    }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {chat.map((c, i) => (
          <div key={i} style={{
            marginBottom: 6, background: "#dabfff", padding: "5px 12px", borderRadius: 8
          }}>
            <b>{c.sender}:</b> {c.content}
          </div>
        ))}
      </div>
      <div style={{
        borderTop: "1px solid #ccc", display: "flex", gap: 8,
        padding: 10, background: "#f4f8fd"
      }}>
        <input type="text" style={{ flex: 1, fontSize: "1.1rem", padding: 8 }}
          placeholder="메시지 입력" value={inputMsg}
          disabled={isFinished}
          onChange={e => setInputMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleChat()} />
        <button style={{ width: 60 }} disabled={isFinished} onClick={handleChat}>보내기</button>
      </div>
    </div>
  );
}
