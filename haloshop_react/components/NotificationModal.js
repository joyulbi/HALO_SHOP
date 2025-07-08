import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

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

const StyledLink = styled.a`
  color: #3b82f6;
  text-decoration: underline;
  user-select: text; /* ✅ 드래그 가능하게 설정 */
`;


const NotificationModal = ({ visible, onClose, notification }) => {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 100000000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  console.log("data : ", notification)

  if (!visible) return null;

  return (
    <ToastContainer>
      <ToastBox>
        <Header>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#10b981"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
            10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
          </svg>
          <h4>알림 도착</h4>
        </Header>
        <Content><strong>문의 ID:</strong> {notification.referenceId}</Content>
        <Content>문의가 답변되었습니다. 확인해 주세요.</Content>
{notification.entity?.id === 1 && (
  <Content>
    👉 <StyledLink
      href="http://localhost:3000/contact"
      target="_blank"
      rel="noopener noreferrer"
    >
      문의 페이지로 이동
    </StyledLink>
  </Content>
)}
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ToastBox>
    </ToastContainer>
  );
};

export default NotificationModal;
