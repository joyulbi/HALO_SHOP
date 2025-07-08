import React, { useEffect, useState } from "react";
import NotificationIconModal from "./NotificationIconModal";
import axios from "axios";

const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNew, setHasNew] = useState(false); // 🔥 아이콘 표시용 상태

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchNotifications = async () => {
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

        setNotifications(list);
        setUnreadCount(unread);
        setHasNew(unread > 0); // 아이콘 표시 여부
      } catch (err) {
        console.error("알림 가져오기 실패", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNew(false); // 🔥 테두리 & 뱃지 제거
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
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
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
