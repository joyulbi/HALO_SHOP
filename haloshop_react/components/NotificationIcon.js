import React, { useEffect, useState } from "react";
import NotificationIconModal from "./NotificationIconModal";
import WebSocketClient from "./WebSocketClient";
import axios from "axios";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNew, setHasNew] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const meRes = await axios.get("http://localhost:8080/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const id = meRes.data?.account?.id;
      if (!id) return;

      const notiRes = await axios.get(`http://localhost:8080/api/notifications/receiver/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = notiRes.data || [];
      const unread = list.filter(n => !n.isRead).length;
      console.log("list :",list);
      setNotifications(list);
      setUnreadCount(unread);
      setHasNew(unread > 0);
    } catch (err) {
      console.error("알림 가져오기 실패", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // WebSocket에서 호출할 함수 (알림 새로고침)
  const handleNewNotification = () => {
    fetchNotifications();
    setHasNew(true); // 푸시 도착 시 빨간 테두리 다시 표시
  };

  const handleOpen = () => {
    setIsOpen(true);
    setHasNew(false);
  };

  return (
    <>
      <button
        title="알림"
        onClick={handleOpen}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          fontSize: '24px',
          cursor: 'pointer',
          position: 'relative',
          border: hasNew ? '2px solid red' : '2px solid transparent',
        }}
      >
        🔔
        {hasNew && <Badge count={unreadCount} />}
      </button>

      {isOpen && (
        <NotificationIconModal
          notiData={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}

      <WebSocketClient onNewNotification={handleNewNotification} />
    </>
  );
};

const Badge = ({ count }) => (
  <span style={{
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px'
  }}>
    {count}
  </span>
);

export default NotificationIcon;
