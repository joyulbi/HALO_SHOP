import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../../utils/axios";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import AuctionInfo from "../../components/auction/AuctionInfo";
import AuctionLog from "../../components/auction/AuctionLog";
import AuctionChat from "../../components/auction/AuctionChat";
import AuctionWinnerInfo from "../../components/auction/AuctionWinnerInfo";

export default function AuctionRoomLayout() {
  const router = useRouter();
  const { id } = router.query;
  const AUCTION_ID = id ? Number(id) : null;
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [chat, setChat] = useState([]);
  const [inputBid, setInputBid] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [startPrice, setStartPrice] = useState(undefined);
  const [status, setStatus] = useState("");
  const [endTime, setEndTime] = useState(""); // 종료 시간
  const [errorMsg, setErrorMsg] = useState("");

  const stompRef = useRef(null);

  // REST 호출 - 경매 기본정보, 입찰로그, 이미지 불러오기
  useEffect(() => {
    if (!AUCTION_ID) return;

    // 경매 정보
    api.get(`/api/auctions/${AUCTION_ID}`).then(res => {
      const data = res.data;
      setTitle(data.title);
      setDesc(data.description);
      setStartPrice(typeof data.startPrice === "number" ? data.startPrice : 0);
      setStatus(data.status || "");
      setEndTime(data.endTime);

      // 입찰 로그
      api.get(`/api/auction-logs/auction/${AUCTION_ID}`).then(res2 => {
        setLogs(res2.data);
      });
    });

    // 경매 이미지
    api.get(`/api/auction-images/auction/${AUCTION_ID}`).then(res => {
      const result = Array.isArray(res.data) ? res.data : [res.data];
      setImages(result);
    });
  }, [AUCTION_ID]);

  // 경매 종료시간 도달 시 자동 상태 변경
  useEffect(() => {
    if (!endTime || status !== "ONGOING") return;
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const delay = end - now;

    if (delay <= 0) {
      setStatus("FINISHED");
      return;
    }

    const timer = setTimeout(() => {
      setStatus("FINISHED");
    }, delay);

    return () => clearTimeout(timer);
  }, [endTime, status]);

  // 최고 입찰가 계산
  const highest = React.useMemo(() => {
    if (typeof startPrice !== "number") return "-";
    if (!logs || logs.length === 0) return startPrice;
    const prices = logs.map(l => Number(l.price)).filter(v => !isNaN(v));
    return prices.length === 0 ? startPrice : Math.max(startPrice, ...prices);
  }, [logs, startPrice]);

  // 최소 입찰가 계산 (10% 이상, 100원 단위 반올림)
  const minBid = React.useMemo(() => {
    if (!logs || logs.length === 0) return startPrice;
    const last = logs[logs.length - 1];
    return Math.ceil(last.price * 1.1 / 100) * 100;
  }, [logs, startPrice]);

  // WebSocket 연결 (입찰, 채팅, 에러 수신)
  useEffect(() => {
    if (!AUCTION_ID) return;

    const sock = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      // 실시간 입찰 로그 수신
      client.subscribe(`/topic/auction/${AUCTION_ID}`, (msg) => {
        const log = JSON.parse(msg.body);
        setLogs(prev => [...prev, log]);
        setErrorMsg("");
      });

      // 입찰 실패 메시지 수신
      client.subscribe(`/topic/auction/${AUCTION_ID}/error`, (msg) => {
        setErrorMsg(msg.body || "입찰 실패");
      });

      // 실시간 채팅 수신
      client.subscribe(`/topic/chat/${AUCTION_ID}`, (msg) => {
        const chatMsg = JSON.parse(msg.body);
        setChat(prev => [...prev, chatMsg]);
      });
    };

    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [AUCTION_ID]);

  // 입찰 전송
  const handleBid = () => {
    if (!inputBid || isNaN(Number(inputBid))) return;
    if (!user || !user.id) {
      setErrorMsg("로그인 후 이용 가능합니다!");
      return;
    }

    const log = {
      auctionId: AUCTION_ID,
      accountId: user.id,
      price: Number(inputBid),
      createdAt: new Date().toISOString(),
    };

    stompRef.current?.publish({
      destination: `/app/auction/${AUCTION_ID}`,
      body: JSON.stringify(log),
    });

    setInputBid("");
  };

  // 채팅 전송
  const handleChat = () => {
    if (!inputMsg) return;
    if (!user) {
      alert("로그인 후 이용 가능합니다!");
      return;
    }

    const msg = {
      auctionId: AUCTION_ID,
      sender: user.nickname || "익명",
      content: inputMsg,
      createdAt: new Date().toISOString(),
    };

    stompRef.current?.publish({
      destination: `/app/chat/${AUCTION_ID}`,
      body: JSON.stringify(msg),
    });

    setInputMsg("");
  };

  // 재등록
  const handleReRegister = () => {
    router.push({
      pathname: "/auction/regist",
      query: {
        title,
        description: desc,
        startPrice: String(startPrice), // 숫자 → 문자열 변환
        imageUrls: JSON.stringify(images.map(img => img.url)), // 배열을 문자열로 변환
      },
    });
  };

  const isOngoing = status === "ONGOING";
  const isFinished = status === "FINISHED";
  const isCanceled = status === "CANCELED";

  if (!AUCTION_ID || typeof startPrice !== "number") return <div>로딩중...</div>;

return (
  <div style={{ background: "#f9f9f9", minHeight: "100vh", padding: "60px 80px" }}>
    
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gridTemplateRows: "auto auto",
      gap: "24px",
      maxWidth: "1400px",
      margin: "0 auto",
      height: "calc(100vh - 120px)"
    }}>
      {/* 경매 정보 */}
      <div style={{
        background: "#fff",
        border: "1px solid #ddd", // ✅ 테두리 추가
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)", // ✅ 그림자 톤 다운
        padding: "30px",
        minHeight: "480px"
      }}>
        <AuctionInfo images={images} title={title} desc={desc} status={status} />
        {isCanceled && user?.admin && (
          <div style={{ textAlign: "right", marginBottom: "12px" }}>
            <button
              onClick={handleReRegister}
              style={{
                background: "#3d6fee",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#264dbd"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3d6fee"}
            >
              이 경매 다시 등록하기
            </button>
          </div>
        )}
      </div>

      {/* 채팅 or 낙찰자 */}
      <div style={{
        background: "#fff",
        border: "1px solid #ddd", // ✅ 테두리 추가
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)", // ✅ 그림자 톤 다운
        padding: "30px",
        minHeight: "480px"
      }}>
        {isOngoing && (
          <AuctionChat
            chat={chat}
            inputMsg={inputMsg}
            setInputMsg={setInputMsg}
            handleChat={handleChat}
            isFinished={false}
          />
        )}
        {(isFinished || isCanceled) && (
          <AuctionWinnerInfo auctionId={AUCTION_ID} />
        )}
      </div>

      {/* 입찰 로그/폼 */}
      <div style={{
        background: "#fff",
        border: "1px solid #ddd", // ✅ 테두리 추가
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)", // ✅ 그림자 톤 다운
        padding: "30px",
        minHeight: "320px",
        gridColumn: "1 / span 2"
      }}>
        {isOngoing && (
          <AuctionLog
            logs={logs}
            highest={highest}
            inputBid={inputBid}
            setInputBid={setInputBid}
            handleBid={handleBid}
            isFinished={false}
            minBid={minBid}
            errorMsg={errorMsg}
            currentUserId={user?.id}
          />
        )}
        {(isFinished || isCanceled) && (
          <AuctionLog
            logs={logs}
            highest={highest}
            isFinished={true}
            errorMsg={isCanceled ? "이 경매는 취소되었습니다." : "경매가 종료되었습니다."}
            currentUserId={user?.id}
          />
        )}
      </div>
    </div>
  </div>
);
}
