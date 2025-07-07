import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import InquiryTable from "./InquiryTable";
import InquiryModal from "./InquiryModal";

const Container = styled.div`
  width: 100%;
`;

const PagingControls = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const PageButton = styled.button`
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    display: none; /* 더 이상 이동 불가 시 숨김 처리 */
  }
`;

const PAGE_SIZE = 10; // 한 페이지당 10개

const InquiriesManagement = ({ status, token }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // status가 바뀌면 페이지를 1로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  // token, status, currentPage가 바뀌면 문의 목록 재조회
  useEffect(() => {
    if (token) {
      fetchInquiries();
    } else {
      setInquiries([]);
      setTotalCount(0);
    }
  }, [status, currentPage, token]);

  const fetchInquiries = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:8080/api/inquiries/status/${status}`, {
        params: { page: currentPage, size: PAGE_SIZE },
        headers: { Authorization: `Bearer ${token}` },
      });

      setInquiries(res.data.data || res.data);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error("목록 불러오기 실패", error);
      setInquiries([]);
      setTotalCount(0);
    }
  };

  const handleSubmit = async (status, inquiry) => {
    if (!token) {
      alert("인증이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/inquiry-answers",
        {
          inquiryId: inquiry.id,
          answer: reply,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("답변이 전송되었습니다.");
      setReply("");
      setSelected(null);
      fetchInquiries();
    } catch (error) {
      console.error("답변 전송 실패", error);
      if (error.response) console.error("서버 응답:", error.response.data);
      alert("답변 전송에 실패했습니다.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!token) {
      alert("인증이 필요합니다.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/api/inquiries/${selected.id}/status`,
        null, // body 없음
        {
          params: { status: newStatus },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("상태가 저장되었습니다.");
      fetchInquiries();
    } catch (error) {
      console.error("상태 저장 실패", error);
      alert("저장 중 오류 발생");
    }
  };

  const handleSelect = async (inquiry) => {
    if (!token) {
      alert("인증이 필요합니다.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/inquiries/${inquiry.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fullInquiry = res.data;

      if (fullInquiry.status === "ANSWERED") {
        const answerRes = await axios.get(`http://localhost:8080/api/inquiry-answers/${inquiry.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fullInquiry.answer = answerRes.data.answer;
      }

      setSelected(fullInquiry);
    } catch (err) {
      console.error("문의 상세 조회 실패", err);
      alert("상세 정보를 불러오는 데 실패했습니다.");
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <Container>
      <InquiryTable inquiries={inquiries} onSelect={handleSelect} />

      <PagingControls>
        <PageButton
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>

        <span>
          {currentPage} / {totalPages || 1}
        </span>

        <PageButton
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          다음
        </PageButton>
      </PagingControls>

      {selected && (
        <InquiryModal
          inquiry={selected}
          reply={reply}
          onReplyChange={setReply}
          onClose={() => setSelected(null)}
          onSubmit={handleSubmit}
          onStatusChange={handleStatusChange}
        />
      )}
    </Container>
  );
};

export default InquiriesManagement;
