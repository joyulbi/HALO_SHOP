import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from '../../utils/axios';
import { useRouter } from "next/router";

export default function AuctionRoomLayout() {
  const router = useRouter();
  const { id } = router.query;
  const AUCTION_ID = id ? Number(id) : null;
  const USER_ID = "user1";

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [chat, setChat] = useState([]);
  const [inputBid, setInputBid] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [highest, setHighest] = useState(0);
  const [status, setStatus] = useState("");

  const stompRef = useRef(null);

  // REST 데이터 axios로 불러오기
  useEffect(() => {
    if (!AUCTION_ID) return;

    api.get(`/api/auctions/${AUCTION_ID}`)
      .then(res => {
        const data = res.data;
        setTitle(data.title);
        setDesc(data.description);
        setHighest(data.start_price || 0);
        setStatus(data.status || "");
      });

    api.get(`/api/auction-images/${AUCTION_ID}`)
      .then(res => {
        const result = Array.isArray(res.data) ? res.data : [res.data];
        setImages(result);
      });

    api.get(`/api/auction-logs/auction/${AUCTION_ID}`)
      .then(res => {
        setLogs(res.data);
        if (res.data && res.data.length > 0) {
          const max = Math.max(...res.data.map(l => l.price));
          setHighest(max);
        }
      });
  }, [AUCTION_ID]);

  // WebSocket 연결 (실시간 입찰/채팅)
  useEffect(() => {
    if (!AUCTION_ID) return;
    const sock = new SockJS("http://localhost:8181/ws");
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/auction/${AUCTION_ID}`, (msg) => {
        const log = JSON.parse(msg.body);
        setLogs(prev => [...prev, log]);
        if (log.price > highest) setHighest(log.price);
      });
      client.subscribe(`/topic/chat/${AUCTION_ID}`, (msg) => {
        const chatMsg = JSON.parse(msg.body);
        setChat(prev => [...prev, chatMsg]);
      });
    };

    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
    // eslint-disable-next-line
  }, [AUCTION_ID, highest]);

  // 입찰 전송
  const handleBid = () => {
    if (!inputBid || isNaN(Number(inputBid))) return;
    if (stompRef.current && stompRef.current.connected && AUCTION_ID) {
      const log = {
        auctionId: AUCTION_ID,
        accountId: USER_ID,
        price: Number(inputBid),
        createdAt: new Date().toISOString(),
      };
      stompRef.current.publish({
        destination: `/app/auction/${AUCTION_ID}`,
        body: JSON.stringify(log),
      });
      setInputBid("");
    }
  };

  // 채팅 전송
  const handleChat = () => {
    if (!inputMsg) return;
    if (stompRef.current && stompRef.current.connected && AUCTION_ID) {
      const msg = {
        auctionId: AUCTION_ID,
        sender: USER_ID,
        content: inputMsg,
        createdAt: new Date().toISOString(),
      };
      stompRef.current.publish({
        destination: `/app/chat/${AUCTION_ID}`,
        body: JSON.stringify(msg),
      });
      setInputMsg("");
    }
  };

  const isFinished = status === "FINISHED" || status === "CANCELED";

  if (!AUCTION_ID) return <div>로딩중...</div>;

  return (
    <div style={{ background: "#ddd", minHeight: "100vh", padding: 0, margin: 0 }}>
      {/* 본문 2x2 grid (상단 네비 없음) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "3fr 2fr",
        gridTemplateRows: "440px 220px",
        gap: "24px",
        padding: "48px 60px"
      }}>
        {/* 왼쪽 상단: 경매정보(이미지+상세) */}
        <div style={{
          gridColumn: "1", gridRow: "1",
          background: "#fff", border: "4px solid #b0c7f8", borderRadius: 12, padding: 28, display: "flex"
        }}>
          {/* 이미지 */}
          <div style={{
            flex: 1, minWidth: 180, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {images.length > 0 ? (
              <img src={images[0].url} alt="경매이미지" style={{ maxHeight: 220, maxWidth: 180 }} />
            ) : "이미지 자리"}
          </div>
          {/* 상세정보 */}
          <div style={{ flex: 1, minWidth: 180, marginLeft: 28 }}>
            <div style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 8 }}>{title || "경매 제목"}</div>
            <div>{desc || "경매 상세 정보"}</div>
            <div style={{ marginTop: 14, fontWeight: "bold" }}>
              {status === "READY"    ? "준비 중"
              : status === "ONGOING" ? "진행 중"
              : status === "FINISHED"? "경매 종료"
              : status === "CANCELED"? "취소됨"
              : status}
            </div>
          </div>
        </div>

        {/* 왼쪽 하단: 입찰 로그 + 입찰폼 */}
        <div style={{
          gridColumn: "1", gridRow: "2",
          background: "#eef3ff", border: "4px solid #3d6fee", borderRadius: 12, padding: 18,
          display: "flex", flexDirection: "row", alignItems: "stretch"
        }}>
          {/* 입찰 로그 */}
          <div style={{ flex: 2, marginRight: 18 }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>경매 로그 실시간 정보</div>
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i}>{log.accountId}님이 {log.price}원에 입찰</div>
            )) : <div>입찰 로그 없음</div>}
          </div>
          {/* 입찰폼 */}
          <div style={{
            flex: 1, background: "#fff", border: "2px solid #111",
            borderRadius: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: 180
          }}>
            <div style={{
              width: "90%", marginBottom: 10, background: "#111", color: "#fff",
              fontWeight: "bold", fontSize: "1.1rem", textAlign: "center", padding: 5, borderRadius: 5
            }}>
              최고 입찰가 {highest}
            </div>
            <input type="number" placeholder="입찰가 입력"
              value={inputBid}
              disabled={isFinished}
              onChange={e => setInputBid(e.target.value)}
              style={{
                width: "90%", fontSize: "1rem", marginBottom: 10, padding: 6, border: "1px solid #ccc", borderRadius: 4
              }} />
            <button style={{
              width: "90%", padding: "8px 0", background: "#ff2222", color: "#fff", fontWeight: "bold",
              border: "none", borderRadius: 5, fontSize: "1rem"
            }} onClick={handleBid} disabled={isFinished}>입찰하기</button>
            {isFinished && <div style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>경매가 종료되었습니다.</div>}
          </div>
        </div>

        {/* 오른쪽 전체: 채팅 */}
        <div style={{
          gridColumn: "2", gridRow: "1 / span 2",
          background: "#e6f0ff", border: "4px solid #5c87e6",
          borderRadius: 14, minHeight: 520, display: "flex", flexDirection: "column"
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {chat.map((c, i) => (
              <div key={i} style={{
                marginBottom: 7, background: "#dabfff", padding: "6px 12px", borderRadius: 8
              }}>
                <b>{c.sender}:</b> {c.content}
              </div>
            ))}
          </div>
          <div style={{
            borderTop: "1px solid #bbb", display: "flex", gap: 8, padding: 10, background: "#f4f8fd"
          }}>
            <input type="text" style={{ flex: 1, fontSize: "1.1rem", padding: 8, borderRadius: 6 }}
              placeholder="메시지 입력" value={inputMsg}
              disabled={isFinished}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleChat()} />
            <button style={{
              width: 60, borderRadius: 6, background: "#377be6", color: "#fff"
            }} disabled={isFinished} onClick={handleChat}>보내기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
