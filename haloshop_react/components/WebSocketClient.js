import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NotificationModal from "./NotificationModal";
import { useAuth } from "../hooks/useAuth";

const WebSocketClient = () => {
  const client = useRef(null);
  const [notification, setNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // 로컬스토리지에서 JWT 토큰 직접 읽기
    const jwtToken = localStorage.getItem("accessToken");
    if (!jwtToken) return;

    client.current = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    client.current.onConnect = () => {
      console.log("웹소켓 연결 성공");

      client.current.subscribe("/user/queue/notifications", (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          setNotification(data);
          setModalVisible(true);
        }
      });
    };

    client.current.onStompError = (frame) => {
      console.error("STOMP 에러:", frame);
    };

    client.current.activate();

    return () => {
      if (client.current) {
        client.current.deactivate();
      }
    };
  }, [user]);

  const closeModal = () => setModalVisible(false);

  return (
    <>
      <NotificationModal
        visible={modalVisible}
        onClose={closeModal}
        notification={notification}
      />
    </>
  );
};

export default WebSocketClient;
