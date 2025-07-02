import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from '../../utils/axios';
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import AuctionInfo from "../../components/auction/AuctionInfo";
import AuctionLog from "../../components/auction/AuctionLog";
import AuctionChat from "../../components/auction/AuctionChat";

export default function AuctionRoomLayout() {
  const router = useRouter();
  const { id } = router.query;
  const AUCTION_ID = id ? Number(id) : null;
  const { user, isLoggedIn } = useAuth();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [chat, setChat] = useState([]);
  const [inputBid, setInputBid] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [highest, setHighest] = useState(null);
  const [startPrice, setStartPrice] = useState(null);
  const [status, setStatus] = useState("");
  const [accountMap, setAccountMap] = useState({}); // accountId → nickname/email 매핑

  const stompRef = useRef(null);

  // REST 데이터 불러오기
  useEffect(() => {
    if (!AUCTION_ID) return;

    api.get(`/api/auctions/${AUCTION_ID}`)
      .then(res => {
        const data = res.data;
        setTitle(data.title);
        setDesc(data.description);
        setStartPrice(data.start_price);
        setHighest(data.start_price);
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
          setHighest(Math.max(max, startPrice ?? 0));
        } else if (startPrice !== null) {
          setHighest(startPrice);
        }
      });
  }, [AUCTION_ID, startPrice]);

  // 입찰로그 내 계정 닉네임 매핑
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!logs || logs.length === 0) return;
      const uniqueIds = [...new Set(logs.map(l => l.accountId))];
      try {
        const res = await api.get(`/api/accounts`, { params: { ids: uniqueIds.join(',') } });
        // [{id: 4, nickname: "조율비"}, ...]
        const map = {};
        res.data.forEach(acc => { map[acc.id] = acc.nickname || acc.email; });
        setAccountMap(map);
      } catch (e) {}
    };
    fetchAccounts();
  }, [logs]);

  // WebSocket 연결 (실시간 입찰/채팅)
  useEffect(() => {
    if (!AUCTION_ID) return;
    const sock = new SockJS("http://localhost:8080/ws");
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
    if (!user || !user.id) {
      alert("로그인 후 이용 가능합니다!");
      return;
    }
    if (stompRef.current && stompRef.current.connected && AUCTION_ID) {
      const log = {
        auctionId: AUCTION_ID,
        accountId: user.id,
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
    if (!user) {
      alert("로그인 후 이용 가능합니다!");
      return;
    }
    if (stompRef.current && stompRef.current.connected && AUCTION_ID) {
      const msg = {
        auctionId: AUCTION_ID,
        sender: user.nickname || user.email || "익명",
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
      <div style={{
        display: "grid",
        gridTemplateColumns: "3fr 2fr",
        gridTemplateRows: "440px 220px",
        gap: "24px",
        padding: "48px 60px"
      }}>
        {/* 왼쪽 상단: 경매 정보 */}
        <div style={{ gridColumn: "1", gridRow: "1" }}>
          <AuctionInfo
            images={images}
            title={title}
            desc={desc}
            status={status}
          />
        </div>
        {/* 왼쪽 하단: 입찰 로그 + 입찰폼 */}
        <div style={{ gridColumn: "1", gridRow: "2" }}>
          <AuctionLog
            logs={logs}
            highest={highest}
            inputBid={inputBid}
            setInputBid={setInputBid}
            handleBid={handleBid}
            isFinished={isFinished}
            accountMap={accountMap}
          />
        </div>
        {/* 오른쪽 전체: 채팅 */}
        <div style={{ gridColumn: "2", gridRow: "1 / span 2" }}>
          <AuctionChat
            chat={chat}
            inputMsg={inputMsg}
            setInputMsg={setInputMsg}
            handleChat={handleChat}
            isFinished={isFinished}
          />
        </div>
      </div>
    </div>
  );
}
