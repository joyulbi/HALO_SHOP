import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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

const InquiryHistory = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    axios.get("http://localhost:8080/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const accountId = res.data?.account?.id;
        if (!accountId) {
          setError("유저 정보가 올바르지 않습니다.");
          setLoading(false);
          return;
        }
        axios.get(`http://localhost:8080/api/inquiries/my?accountId=${accountId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res2 => {
            setInquiries(res2.data);
            setLoading(false);
          })
          .catch(() => {
            setError("문의 내역을 불러오지 못했습니다.");
            setLoading(false);
          });
      })
      .catch(() => {
        setError("유저 정보가 올바르지 않습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <Container><Title>나의 문의 내역</Title><div>로딩중...</div></Container>;
  if (error) return <Container><Title>나의 문의 내역</Title><EmptyMessage>{error}</EmptyMessage></Container>;
  if (inquiries.length === 0) return <Container><Title>나의 문의 내역</Title><EmptyMessage>문의 내역이 없습니다.</EmptyMessage></Container>;

  return (
    <Container>
      <Title>나의 문의 내역</Title>
      <CardList>
        {inquiries.map(inquiry => (
          <Card key={inquiry.id} status={inquiry.status}>
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
              <span>작성일: {new Date(inquiry.createdAt).toLocaleDateString()}</span>
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
    </Container>
  );
};

export default InquiryHistory;