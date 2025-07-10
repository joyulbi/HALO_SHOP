import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NotificationModal from "./NotificationModal";
import { useAuth } from "../hooks/useAuth";

const WebSocketClient = ({ onNewNotification }) => {
  const client = useRef(null);
  const [notification, setNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useAuth();

 useEffect(() => {
  if (!user) return;

  const jwtToken = localStorage.getItem("accessToken");
  if (!jwtToken) return;

  client.current = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    debug: (str) => console.log("[STOMP]", str),
    connectHeaders: {
      Authorization: `Bearer ${jwtToken}`,
    },
    onWebSocketClose: (evt) => {
      console.warn("웹소켓 연결 종료:", evt);
    },
    onWebSocketError: (evt) => {
      console.error("웹소켓 에러:", evt);
    },
  });

  client.current.onConnect = () => {
    client.current.subscribe(`/user/${user?.id}/queue/notifications`, (message) => {
      if (message.body) {
        try {
          const data = JSON.parse(message.body);
          setNotification(data);
          setModalVisible(true);
          if (onNewNotification) onNewNotification();
        } catch (err) {
          console.error("메시지 파싱 에러:", err);
        }
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
