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

const InquiriesManagement = ({ status }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setCurrentPage(1); // status 변경시 페이지 초기화
  }, [status]);

  useEffect(() => {
    fetchInquiries();
  }, [status, currentPage]);

  const fetchInquiries = async () => {
    try {
      // 서버가 page, size 파라미터로 페이징 처리한다고 가정
      const res = await axios.get(`http://localhost:8080/api/inquiries/status/${status}`, {
        params: {
          page: currentPage,
          size: PAGE_SIZE,
        },
      });

      // 서버 응답 형태가 { data: [...], totalCount: n } 이라고 가정
      setInquiries(res.data.data || res.data); // 만약 data 구조가 다르면 조정 필요
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error("목록 불러오기 실패", error);
      setInquiries([]);
      setTotalCount(0);
    }
  };

const handleSubmit = async (status, inquiry) => {
  try {
    await axios.post("http://localhost:8080/api/inquiry-answers", {
      inquiryId: inquiry.id,
      answer: reply,
      status, // 필요하다면 status도 함께 전송
    });

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
  try {
    await axios.patch(
      `http://localhost:8080/api/inquiries/${selected.id}/status`,
      null, // body 없음
      { params: { status: newStatus } }
    );
    alert("상태가 저장되었습니다.");
    fetchInquiries();
  } catch (error) {
    console.error("상태 저장 실패", error);
    alert("저장 중 오류 발생");
  }
};

const handleSelect = async (inquiry) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/inquiries/${inquiry.id}`);
    const fullInquiry = res.data;

    // 답변이 있다면 추가로 요청해서 answer 포함
    if (fullInquiry.status === "ANSWERED") {
      const answerRes = await axios.get(`http://localhost:8080/api/inquiry-answers/${inquiry.id}`);
      fullInquiry.answer = answerRes.data.answer; // ✅ 답변 본문 저장
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
          onClose={() => setSelected(null)} // ✅ 고침
          onSubmit={handleSubmit}
          onStatusChange={handleStatusChange}
        />
      )}
    </Container>
  );
};

export default InquiriesManagement;
