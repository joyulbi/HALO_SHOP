import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
  align-items: flex-start; /* 여기만 변경 */
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  gap: 0.25rem;
  font-size: 1.04rem;
  color: #444;

  & > strong {
    color: #7b7b7b;
    font-weight: 600;
    font-size: 0.98rem;
    margin: 0;
  }
`;

const Nickname = styled.span`
  font-weight: 700;
  color: #4f46e5;
  font-size: 1.08rem;
  margin-left: 0.2rem;
`;

const Email = styled.span`
  font-weight: 400;
  color: #7b7b7b;
  font-size: 0.85rem;
  margin-left: 0.4rem;
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

const WriterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;        /* 줄바꿈 방지 */
  overflow: hidden;           /* 넘칠 때 숨기기 */
  text-overflow: ellipsis;    /* 넘칠 때 ... 표시 */
  max-width: 200px;           /* 너비 제한, 필요시 조절 */
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

const StatusSelect = styled.select`
  padding: 0.3rem 0.6rem;
  font-size: 0.98rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1.5px solid #ccc;
  color: #222;
  background: white;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #eef2ff;
  }
`;

const Label = styled.label`
  display: block;
  margin: 0 0 0.5rem 0;
  font-size: 1.02rem;
  font-weight: 500;
  color: #6366f1;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 0.9rem 1rem;
  font-size: 1.04rem;
  border: 1.5px solid #e0e7ef;
  border-radius: 10px;
  background: #fff;
  resize: vertical;
  transition: border 0.2s, background 0.2s;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #eef2ff;
  }
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

const InquiryModal = ({
  inquiry,
  reply,
  onReplyChange,
  onClose,
  onSubmit,
  onStatusChange,
}) => {
  if (!inquiry) return null;

  const [localStatus, setLocalStatus] = useState(inquiry.status);
  console.log("선택된 문의 : ", inquiry);
  useEffect(() => {
    setLocalStatus(inquiry.status);
  }, [inquiry]);

  const ApiCallUrl = "http://localhost:8080";

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        {/* 왼쪽: 상세보기 */}
        <MainPanel>
          <Row>
            <InfoItem>
              <strong>카테고리</strong>
              <InfoValue>{inquiry.entity.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <strong>작성자</strong>
              <WriterInfo>
                <Nickname>{inquiry.account.nickname}</Nickname>
                <Email>({inquiry.account.email})</Email>
              </WriterInfo>
            </InfoItem>
            <InfoItem>
              <strong>상태</strong>
              <StatusSelect
                value={localStatus}
                onChange={e => {
                  setLocalStatus(e.target.value);
                  onStatusChange(e.target.value);
                }}
                disabled={localStatus === "ANSWERED"}
              >
                <option value="SUBMITTED">접수</option>
                <option value="REVIEWING">검토중</option>
                <option value="ANSWERED" disabled>답변완료</option>
              </StatusSelect>
            </InfoItem>
          </Row>
          <Title>{inquiry.title}</Title>
          <Label>내용</Label>
          <ReadOnlyTextArea value={inquiry.content} readOnly />
          {inquiry.file && (
            <div style={{marginTop: "0.7rem"}}>
              <strong style={{color:"#7b7b7b", fontWeight:600, fontSize:"0.98rem", marginRight:"0.3rem"}}>첨부파일:</strong>
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

        {/* 오른쪽: 답변영역 */}
        <AnswerPanel>
          <div>
            <Label htmlFor="reply">
              {localStatus === "ANSWERED" ? "답변 확인" : "답변 작성"}
            </Label>
            {localStatus === "ANSWERED" ? (
              // 답변완료 시: 읽기 전용 textarea에 답변 표시
              <ReadOnlyTextArea value={inquiry.answer || ""} readOnly />
            ) : (
              // 답변 작성 가능 시: 입력 textarea와 전송 버튼
              <>
                <TextArea
                  id="reply"
                  placeholder="답변을 입력하세요"
                  value={reply}
                  onChange={e => onReplyChange(e.target.value)}
                />
                <Button
                  primary
                  onClick={() => onSubmit(localStatus, inquiry)}
                  disabled={!reply.trim()}
                >
                  답변 전송
                </Button>
              </>
            )}
          </div>
          <Button onClick={onClose}>닫기</Button>
        </AnswerPanel>
      </ModalContainer>
    </Overlay>
  );
};

export default InquiryModal;