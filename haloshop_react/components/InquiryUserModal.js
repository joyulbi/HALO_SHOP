import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(30, 41, 59, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 0;
  border-radius: 20px;
  max-width: 1000px;
  width: 95vw;
  min-height: 600px;
  box-shadow: 0 8px 32px rgba(30, 41, 59, 0.18), 0 1.5px 6px rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  animation: fadeIn 0.25s;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px);}
    to { opacity: 1; transform: translateY(0);}
  }
`;

const MainPanel = styled.div`
  flex: 1.2;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  border-right: 1.5px solid #e5e7eb;
  min-width: 0;
`;

const AnswerPanel = styled.div`
  flex: 0.9;
  min-width: 320px;
  max-width: 420px;
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f8fafc;
`;

const Row = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-bottom: 1.2rem;
  align-items: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.04rem;
  color: #444;
  & > strong {
    color: #7b7b7b;
    font-weight: 600;
    font-size: 0.98rem;
    margin-right: 0.3rem;
  }
`;

const InfoValue = styled.span`
  font-weight: 700;
  color: #4f46e5;
  font-size: 1.08rem;
  margin-left: 0.2rem;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.55rem;
  font-weight: 700;
  color: #22223b;
  letter-spacing: -0.5px;
  word-break: break-all;
`;

const ReadOnlyTextArea = styled.textarea`
  width: 100%;
  min-height: 220px;
  padding: 1rem 1.1rem;
  font-size: 1.08rem;
  border: 1.5px solid #e0e7ef;
  border-radius: 10px;
  background: #f8fafc;
  resize: none;
  color: #444;
  margin-bottom: 1.5rem;
  font-family: inherit;
  pointer-events: none;
  outline: none;
`;

const FileLink = styled.a`
  display: inline-block;
  margin-top: 0.3rem;
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.95rem;
  &:hover {
    color: #1e40af;
  }
`;

const Label = styled.label`
  display: block;
  margin: 0 0 0.5rem 0;
  font-size: 1.02rem;
  font-weight: 500;
  color: #6366f1;
`;


const Button = styled.button`
  background: ${({primary}) => primary ? "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)" : "#f3f4f6"};
  color: ${({primary}) => primary ? "#fff" : "#22223b"};
  border: none;
  padding: 0.55rem 1.5rem;
  border-radius: 8px;
  font-size: 1.04rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({primary}) => primary ? "0 2px 8px rgba(99,102,241,0.08)" : "none"};
  transition: background 0.18s, color 0.18s;
  margin-top: 1.2rem;
  width: 100%;
  &:hover:enabled {
    background: ${({primary}) => primary ? "linear-gradient(90deg, #4f46e5 0%, #2563eb 100%)" : "#e5e7eb"};
    color: ${({primary}) => primary ? "#fff" : "#22223b"};
  }
  &:disabled {
    background: #e5e7eb;
    color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// API 호출 주소
const ApiCallUrl = "http://localhost:8080";

const InquiryUserModal = ({
  inquiry,
  onClose,
  accountId,
  onDelete
}) => {
  if (!inquiry) return null;

  const [answer, setAnswer] = useState("");

  // 문의 삭제 API 불러오기
  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !accountId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(
        `${ApiCallUrl}/api/inquiries/${inquiry.id}/my?accountId=${accountId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("문의가 삭제되었습니다.");
      if (typeof onDelete === "function") onDelete(inquiry.id);
      onClose();
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  };

  // 답변 불러오기
  useEffect(() => {
    const fetchAnswer = async () => {
      if (inquiry.status === "ANSWERED") {
        try {
          const res = await axios.get(`${ApiCallUrl}/api/inquiry-answers/${inquiry.id}`);
          setAnswer(res.data.answer || ""); // 예외 처리
        } catch (e) {
          console.error("답변 조회 실패", e);
          setAnswer("답변을 불러오는 데 실패했습니다.");
        }
      }
    };

    fetchAnswer();
  }, [inquiry]);

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        {/* 왼쪽: 상세보기 */}
        <MainPanel>
          <Row>
            <InfoItem>
              <strong>카테고리</strong>
              <InfoValue>{inquiry.categoryName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <strong>작성자</strong>
              <InfoValue>{inquiry.accountName || "익명"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <strong>상태</strong>
              <InfoValue>
                {inquiry.status === "ANSWERED"
                  ? "답변완료"
                  : inquiry.status === "REVIEWING"
                  ? "검토중"
                  : "접수됨"}
              </InfoValue>
            </InfoItem>
          </Row>
          <Title>{inquiry.title}</Title>
          <Label>내용</Label>
          <ReadOnlyTextArea value={inquiry.content} readOnly />
          {inquiry.file && (
            <div style={{ marginTop: "0.7rem" }}>
              <strong style={{ color: "#7b7b7b", fontWeight: 600, fontSize: "0.98rem", marginRight: "0.3rem" }}>첨부파일:</strong>
              <FileLink
                href={`${ApiCallUrl}/api/files/${encodeURIComponent(inquiry.file)}`}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                {inquiry.file}
              </FileLink>
            </div>
          )}
        </MainPanel>

        {/* 오른쪽: 답변영역 - 상태가 ANSWERED일 때만 표시 */}
        {inquiry.status === "ANSWERED" && (
          <AnswerPanel>
            <div>
              <Label htmlFor="reply">답변 확인</Label>
              <ReadOnlyTextArea value={answer} readOnly />
            </div>
            <Button onClick={onClose}>닫기</Button>
          </AnswerPanel>
        )}

        {/* "제출됨" 상태일 때만 삭제 버튼 표시 */}
        {inquiry.status === "SUBMITTED" && (
          <div style={{ padding: "2rem", textAlign: "right" }}>
            <Button
              style={{ background: "#ef4444", color: "#fff", width: "auto" }}
              onClick={handleDelete}
            >
              문의 삭제
            </Button>
          </div>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default InquiryUserModal;