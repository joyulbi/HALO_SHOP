import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { notificationUtil } from "./NotificiationUtil"; // 경로 맞게 조정

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ToastBox = styled.div`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  width: 320px;
  animation: ${fadeInUp} 0.35s ease-out;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
`;

const Content = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0.25rem 0;
  line-height: 1.5;
  user-select: none;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  margin-top: 0.5rem;
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #6b7280;
  }
`;

// 숫자포매팅
const formatNumber = (num) => {
  if (typeof num === "number") {
    return new Intl.NumberFormat().format(num);
  }

  if (typeof num === "string" && /^\d+$/.test(num)) {
    return new Intl.NumberFormat().format(Number(num));
  }

  return num; // 숫자가 아니면 그대로 반환
};

const NotificationModal = ({ visible, onClose, notification }) => {
  const [detailTitle, setDetailTitle] = useState(null);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !notification) return;

    const fetchDetail = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setDetailTitle(null);
        setAmount(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await notificationUtil(notification, token);
      setDetailTitle(result.title);

      // 👇 600번대 포인트 로그 amount 가져오기
      if (notification.entity?.id === 601 || notification.entity?.id === 602) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/pointlog/${notification.referenceId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();
          setAmount(data.amount);
        } catch (err) {
          console.error("포인트 로그 조회 실패:", err);
          setAmount(null);
        }
      }

      setLoading(false);
    };

    fetchDetail();
  }, [visible, notification]);

  if (!visible || !notification) return null;

  const handleClick = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      onClose();
      return;
    }

    try {
      await fetch(
        `http://localhost:8080/api/notifications/${notification.id}/read?isRead=true`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("알림 읽음 처리 실패", err);
    }

    if (notification.entity?.id === 100) {
      window.location.href = "http://localhost:3000/contact?selectedTab=list";
    } else if (notification.entity?.id === 201) {
      window.location.href = "http://localhost:3000/mypage/auction-result";
    } else if (notification.entity?.id === 301) {
      window.location.href = "http://localhost:3000/campaign";
    } else if ([401, 402, 403].includes(notification.entity?.id)) {
      window.location.href = "http://localhost:3000/delivery";
    }

    onClose();
  };

  return (
    <ToastContainer>
      <ToastBox onClick={handleClick}>
        <Header>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#10b981"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
          </svg>
          <h4>알림 도착</h4>
        </Header>

        {loading ? (
          <Content>불러오는 중...</Content>
        ) : (
          <>
            {notification.entity?.id === 100 && (
              <Content>
                <strong>문의 제목:</strong> {detailTitle}
              </Content>
            )}
            {(notification.entity?.id === 201 || notification.entity?.id === 203) && (
              <Content>
                <strong>경매품:</strong> {detailTitle}
              </Content>
            )}
            {notification.entity?.id === 301 && (
              <Content>
                <strong>시즌:</strong> {detailTitle}
              </Content>
            )}
            {[401, 402, 403].includes(notification.entity?.id) && (
              <Content>
                <strong>배송품:</strong> {detailTitle}
              </Content>
            )}
            {(notification.entity?.id === 601 || notification.entity?.id === 602) && (
              <Content>
                <strong>현재 포인트: </strong>
                <span style={{ fontWeight: "700", color: "#111827" }}>
                  {formatNumber(amount) ?? "??"}
                </span>{" "}
                <span style={{ color: "#10b981", fontWeight: 600 }}>Pt</span>
              </Content>
            )}

          <Content>
            {notification.entity?.id === 203
              ? "낙찰을 확정하지 않아 취소되었습니다."
              : notification.entity?.id === 201
              ? "경매품을 낙찰 받으셨습니다."
              : notification.entity?.id === 301
              ? "새 시즌이 시작되었습니다."
              : notification.entity?.id === 401
              ? "출고 준비중입니다."
              : notification.entity?.id === 402
              ? "배송이 시작되었습니다."
              : notification.entity?.id === 403
              ? "배송이 완료됐습니다."
              : notification.entity?.id === 601
              ? (
                <>
                  <span style={{ fontWeight: "700", color: "#111827" }}>
                    {formatNumber(amount) ?? "??"}
                  </span>{" "}
                  <span style={{ color: "#10b981", fontWeight: 600 }}>Pt</span>가 적립되었습니다.
                </>
              )
              : notification.entity?.id === 602
              ? (
                <>
                  <span style={{ fontWeight: "700", color: "#111827" }}>
                    {formatNumber(amount) ?? "??"}
                  </span>{" "}
                  <span style={{ color: "#10b981", fontWeight: 600 }}>Pt</span>를 사용하였습니다.
                </>
              )
              : "문의가 답변되었습니다."}
          </Content>
          </>
        )}

        <CloseButton
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          닫기
        </CloseButton>
      </ToastBox>
    </ToastContainer>
  );
};

export default NotificationModal;
