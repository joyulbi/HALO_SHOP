import React, { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AuctionChat({
  chat, inputMsg, setInputMsg, handleChat, isFinished
}) {
  const { user } = useAuth();
  const scrollBoxRef = useRef(null);

  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div style={{
      background: "#f6f6f6",
      border: "1px solid #ddd",
      borderRadius: 14,
      minHeight: 450,
      maxHeight: 450,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* 스크롤 고정 박스 */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: "340px",
        maxHeight: "340px"
      }}>
        {/* 실제 스크롤 박스 */}
        <div
          ref={scrollBoxRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}
        >
          {chat.map((c, i) => {
            const isMe = user && c.sender === user.nickname;
            return (
              <div key={i} style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  maxWidth: "70%",
                  padding: "8px 14px",
                  borderRadius: 14,
                  background: isMe ? "#4a9fff" : "#f5d0ff",
                  color: isMe ? "#fff" : "#000",
                  fontSize: "0.95rem",
                  wordBreak: "break-word"
                }}>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    {c.sender}
                  </div>
                  {c.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 채팅 입력창 */}
      <div style={{
        borderTop: "1px solid #ddd",
        padding: 10,
        background: "#f6f6f6"
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            style={{
              flex: 1,
              fontSize: "1rem",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
            placeholder="메시지 입력"
            value={inputMsg}
            disabled={isFinished}
            onChange={e => setInputMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleChat()}
          />
          <button
            style={{
              width: 80,
              borderRadius: 6,
              background: "#4a9fff",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
            disabled={isFinished}
            onClick={handleChat}
          >
            보내기
          </button>
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
