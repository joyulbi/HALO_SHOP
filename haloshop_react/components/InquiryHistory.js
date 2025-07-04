import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import InquiryUserModal from "./InquiryUserModal";

const Container = styled.div`
  width: 50vw;
  min-height: 100vh;
  margin: 0 auto;
  background: #f4f6fa;
  padding: 2.5rem 1.5rem;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #22223b;
  font-size: 2rem;
  font-weight: 800;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(30,41,59,0.07);
  padding: 1.5rem 1.5rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  border-left: 6px solid ${({ status }) =>
    status === "ANSWERED" ? "#60a5fa" : status === "REVIEWING" ? "#facc15" : "#a5b4fc"};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CardTitle = styled.div`
  font-size: 1.18rem;
  font-weight: 700;
  color: #22223b;
`;

const CardStatus = styled.span`
  font-size: 0.98rem;
  font-weight: 600;
  color: ${({ status }) =>
    status === "ANSWERED" ? "#2563eb" : status === "REVIEWING" ? "#eab308" : "#6366f1"};
  background: ${({ status }) =>
    status === "ANSWERED" ? "#e0f2fe" : status === "REVIEWING" ? "#fef9c3" : "#eef2ff"};
  padding: 0.28rem 0.9rem;
  border-radius: 7px;
  margin-left: 0.7rem;
`;

const CardInfo = styled.div`
  font-size: 0.97rem;
  color: #666;
  display: flex;
  gap: 1.5rem;
`;

const CardContent = styled.div`
  font-size: 1.01rem;
  color: #444;
  margin-top: 0.2rem;
  margin-bottom: 0.3rem;
`;

const AnswerBadge = styled.span`
  display: inline-block;
  font-size: 0.93rem;
  font-weight: 600;
  color: ${({ answered }) => (answered ? "#22c55e" : "#64748b")};
  background: ${({ answered }) => (answered ? "#dcfce7" : "#f1f5f9")};
  border-radius: 6px;
  padding: 0.22rem 0.7rem;
  margin-left: 0.5rem;
`;

const EmptyMessage = styled.div`
  padding: 3rem 0;
  text-align: center;
  color: #999;
  font-size: 1.1rem;
`;

const FilterBar = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;

const StatusButton = styled.button`
  background: ${({ active }) => (active ? "#6366f1" : "#f3f4f6")};
  color: ${({ active }) => (active ? "#fff" : "#22223b")};
  border: none;
  border-radius: 6px;
  padding: 0.38rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #6366f1;
    color: #fff;
  }
`;

// 날짜 표시 포맷팅
function formatDateTime(dateString) {
  const date = new Date(dateString);
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 상태 필터링 옵션
const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "SUBMITTED", label: "접수됨" },
  { value: "REVIEWING", label: "검토중" },
  { value: "ANSWERED", label: "답변완료" },
];

const InquiryHistory = () => {
  const ApiCallUrl = "http://localhost:8080";
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    axios.get(`${ApiCallUrl}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const userId = res.data?.account?.id;
        if (!userId) throw new Error();
        setAccountId(userId);
        return axios.get(`${ApiCallUrl}/api/inquiries/my?accountId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(res2 => setInquiries(res2?.data || []))
      .catch(() => setError("데이터를 불러오는 중 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Container><Title>나의 문의 내역</Title><div>로딩중...</div></Container>;
  if (error) return <Container><Title>나의 문의 내역</Title><EmptyMessage>{error}</EmptyMessage></Container>;
  if (!inquiries.length) return <Container><Title>나의 문의 내역</Title><EmptyMessage>문의 내역이 없습니다.</EmptyMessage></Container>;

  // 상태 필터 및 정렬 축약
  const sortedInquiries = [...inquiries]
    .filter(i => !statusFilter || i.status === statusFilter)
    .sort((a, b) => b.id - a.id);

  return (
    <Container>
      <Title>나의 문의 내역</Title>
      <FilterBar>
        <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>문의 상태 :</span>
        {STATUS_OPTIONS.map(opt => (
          <StatusButton
            key={opt.value}
            active={statusFilter === opt.value}
            onClick={() => setStatusFilter(opt.value)}
            type="button"
          >
            {opt.label}
          </StatusButton>
        ))}
      </FilterBar>
      <CardList>
        {sortedInquiries.map(inquiry => (
          <Card
            key={inquiry.id}
            status={inquiry.status}
            onClick={() => setSelectedInquiry(inquiry)}
            style={{ cursor: "pointer" }}
          >
            <CardHeader>
              <CardTitle>{inquiry.title}</CardTitle>
              <CardStatus status={inquiry.status}>
                {inquiry.status === "ANSWERED"
                  ? "답변완료"
                  : inquiry.status === "REVIEWING"
                  ? "검토중"
                  : "접수됨"}
              </CardStatus>
            </CardHeader>
            <CardInfo>
              <span>카테고리: {inquiry.entity?.name || "-"}</span>
              <span>작성일: {formatDateTime(inquiry.createdAt)}</span>
              <AnswerBadge answered={inquiry.status === "ANSWERED"}>
                {inquiry.status === "ANSWERED" ? "답변 있음" : "답변 대기"}
              </AnswerBadge>
            </CardInfo>
            <CardContent>
              {inquiry.content}
            </CardContent>
          </Card>
        ))}
      </CardList>
      {selectedInquiry && (
        <InquiryUserModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          fromHistory
          accountId={accountId}
        />
      )}
    </Container>
  );
};

export default InquiryHistory;