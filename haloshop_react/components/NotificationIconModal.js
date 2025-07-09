import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const ModalWrapper = styled.div`
  position: fixed;
  top: 25rem;
  right: 1.5rem;
  width: 320px;
  max-height: 70vh;
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
  position: relative; /* 추가 */
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
  }
`;

const RedDot = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  background-color: #ef4444; /* 빨간색 */
  border-radius: 50%;
`;

const NotificationIconModal = ({ onClose, notiData }) => {
  const [accountId, setAccountId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchInquiryTitles = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const withTitles = await Promise.all(
        notiData.map(async (n) => {
          // 문의 알림
          if (n.entityId === 100) {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/inquiries/${n.referenceId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return { ...n, inquiryTitle: res.data.title };
            } catch (e) {
              console.error(`문의 제목 조회 실패`, e);
              return { ...n, inquiryTitle: null };
            }
          }

          // 경매 낙찰 알림
          if (n.entityId === 201) {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/auctions/${n.referenceId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return { ...n, auctionTitle: res.data.title };
            } catch (e) {
              console.error(`경매 제목 조회 실패`, e);
              return { ...n, auctionTitle: null };
            }
          }

          // 그 외
          return n;
        })
      );

      setNotifications(withTitles);
    } catch (err) {
      setError("알림을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  fetchInquiryTitles();
}, [notiData]);

  const handleNotificationClick = async (id, entityId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `http://localhost:8080/api/notifications/${id}/read?isRead=true`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );

      // entityId별 리다이렉트 처리
      if (entityId === 100) {
        window.location.href = "http://localhost:3000/contact?selectedTab=list";
      } else if (entityId === 201) {
        window.location.href = "http://localhost:3000/mypage/auction-result";
      }

    } catch (err) {
      console.error("알림 읽음 처리 실패", err);
    }
  };

  return (
    <ModalWrapper>
      <Header>
        <h3>알림 목록</h3>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </Header>

      {loading ? (
        <p>불러오는 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : notifications.length === 0 ? (
        <p>알림이 없습니다.</p>
      ) : (
        notifications.map(n => (
        <NotificationItem key={n.id} onClick={() => handleNotificationClick(n.id, n.entityId)}>
          {!n.isRead && <RedDot />}
          <strong>
            {n.entityId === 100
              ? n.inquiryTitle || `문의 ID: ${n.referenceId}`
              : n.entityId === 201
              ? n.auctionTitle || `경매 ID: ${n.referenceId}`
              : n.title || `ID: ${n.referenceId}`}
          </strong>
          <p>
            {n.entityId === 201
              ? "경매품을 낙찰 받으셨습니다."
              : n.message || "문의가 답변되었습니다."}
          </p>
        </NotificationItem>
        ))
      )}
    </ModalWrapper>
  );
};

export default NotificationIconModal;
