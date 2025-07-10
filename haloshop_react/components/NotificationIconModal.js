import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { notificationUtil } from "./NotificiationUtil";

// 기존 스타일링
const ModalWrapper = styled.div`
  position: fixed;
  top: 25rem;
  right: 1.5rem;
  width: 320px;
  max-height: 50vh;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  z-index: 9999;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: #374151;
  }
`;

const NotificationItem = styled.div`
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #4b5563;
  }

  strong {
    color: #111827;
    display: block;
    /* 텍스트 자르기 */
    max-width: 100%; /* 부모 div 크기를 따라감 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    /* 마우스 오버 시 전체 텍스트를 보이게 */
    transition: all 0.3s ease;
    /* 제한된 글자 수 */
    max-width: 100%;
    /* 기본적으로 최대 20자 */
    width: calc(100% - 25px);  /* 버튼과 여백을 빼는 효과 */

    &:hover {
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      background-color: #f0f0f0;
      padding: 0.5rem 1rem;
      word-wrap: break-word;
    }
  }
`;

const RedDot = styled.span`
  position: absolute;
  top: 10px;
  left: 4px;   /* 오른쪽에서 왼쪽으로 이동 */
  width: 5px;
  height: 5px;
  background-color: #ef4444;
  border-radius: 50%;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;  /* 28px에서 8px로 이동 */
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    color: #ef4444;
  }

  svg {
    font-size: 16px;  /* 아이콘 크기 조절 */
  }
`;

// 알림 시간 포매팅
const formatTimeAgo = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();

  const diffMs = now - created; // 밀리초 차이
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 날짜 포매팅
  if (diffMinutes < 1) {
    return `방금`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    const month = created.getMonth() + 1; // 월은 0부터 시작
    const day = created.getDate();
    return `${month}월 ${day}일`;
  }
};

// 숫자포매팅
const formatNumber = (num) => {
  if (typeof num === "number") return new Intl.NumberFormat().format(num);
  if (typeof num === "string" && /^\d+$/.test(num)) return new Intl.NumberFormat().format(Number(num));
  return num;
};

const NotificationIconModal = ({ onClose, notiData, me }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const receiverId = me;


  useEffect(() => {
    const fetchNotificationDetails = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const withTitles = await Promise.all(
          notiData.map((n) => notificationUtil(n, token))
        );
        setNotifications(withTitles);
      } catch (err) {
        setError("알림을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetails();
  }, [notiData]);

  // 알림 클릭 시 읽음 처리 및 URL 리다이렉트
  const handleNotificationClick = async (id, entityId) => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.patch(
        `http://localhost:8080/api/notifications/${id}/read?isRead=true`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      // Redirect
      if (entityId === 100) {
        window.location.href = "http://localhost:3000/contact?selectedTab=list";
      } else if (entityId === 201) {
        window.location.href = "http://localhost:3000/mypage/auction-result";
      } else if (entityId === 301) {
        window.location.href = "http://localhost:3000/campaign"
      } else if ([401, 402, 403].includes(entityId)) {
      window.location.href = "http://localhost:3000/delivery";
      }
    } catch (err) {
      console.error("알림 읽음 처리 실패", err);
    }
  };

  // 모달창 닫기 시 알림 모두 읽음 처리
  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/mark-all-as-read/${receiverId}?isRead=true`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 알림 목록도 업데이트할 필요가 있을 경우 상태 변경 처리
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      onClose(); // 모달 닫기
    } catch (err) {
      console.error("알림 모두 읽음 처리 실패", err);
    }
  };

  // 알림 삭제 호출
  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("알림 삭제 실패", err);
    }
  };



  return (
    <ModalWrapper>
      <Header>
        <h3>알림 목록</h3>
        <CloseButton onClick={() => { 
          handleMarkAllAsRead(); 
          onClose();
        }}> &times;
        </CloseButton>
      </Header>

      {loading ? (
        <p>불러오는 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : notifications.length === 0 ? (
        <p>알림이 없습니다.</p>
      ) : (
        notifications.map((n) => (
          <NotificationItem
            key={n.id}
            onClick={() => handleNotificationClick(n.id, n.entityId)}
          >
            {!n.isRead && <RedDot />}
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 버블링 방지
                handleDelete(n.id);
              }}
            >
              <DeleteOutlined />
            </DeleteButton>
            {(n.entityId !== 601 && n.entityId !== 602) && (
              <strong>{n.title || `ID: ${n.referenceId}`}</strong>
            )}
            <p>
              {n.entityId === 203
                ? "낙찰을 확정하지 않아 취소 되었습니다."
                : n.entityId === 201
                ? "경매품을 낙찰 받으셨습니다."
                : n.entityId === 301
                ? "새 시즌이 시작되었습니다."
                : n.entityId === 401
                ? "출고 준비중입니다."
                : n.entityId === 402
                ? "배송이 시작되었습니다."
                : n.entityId === 403
                ? "배송이 완료됐습니다."
                : n.entityId === 601
                ? <>
                    <span style={{ fontWeight: "700", color: "#111827" }}>{formatNumber(n.amount)}</span>{" "}
                    <span style={{ color: "#10b981", fontWeight: 600 }}>Pt</span>가 적립되었습니다.
                  </>
                : n.entityId === 602
                ? <>
                    <span style={{ fontWeight: "700", color: "#111827" }}>{formatNumber(n.amount)}</span>{" "}
                    <span style={{ color: "#10b981", fontWeight: 600 }}>Pt</span>를 사용하였습니다.
                  </>
                : n.message || "문의가 답변되었습니다."}
            </p>
            <small style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
              {formatTimeAgo(n.createdAt)}
            </small>
          </NotificationItem>
        ))
      )}
    </ModalWrapper>
  );
};

export default NotificationIconModal;
