import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketClient = () => {
  const client = useRef(null); // ← 여기 반드시 useRef로 초기화

  useEffect(() => {
    client.current = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
    });

    client.current.onConnect = () => {
      console.log("웹소켓 연결 성공");

      client.current?.subscribe("/topic/notifications", (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          console.log("알림 수신:", data);
          // 알림 UI 처리 등
        }
      });
    };

    client.current.onStompError = (frame) => {
      console.error("STOMP 에러", frame);
    };

    client.current.activate();

    return () => {
      client.current?.deactivate();
    };
  }, []);

  return null;
};

export default WebSocketClient;
