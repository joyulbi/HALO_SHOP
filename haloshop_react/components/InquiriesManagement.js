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

const InquiriesManagement = ({ status, user, token }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
console.log("token:", token);
  // status가 바뀌면 페이지를 1로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  // token, status, currentPage가 바뀌면 문의 목록 재조회
useEffect(() => {
  if (status) {
    console.log("fetchInquiries 호출 직전:", { token, status });
    fetchInquiries();
  } else {
    console.log("fetchInquiries 호출 조건 미충족", { token, status });
  }
}, [status, currentPage]);

const fetchInquiries = async () => {

  try {
    const res = await axios.get(`http://localhost:8080/api/inquiries/status/${status}`, {
      params: { page: currentPage, size: PAGE_SIZE },
    });

    console.log("API 응답 데이터:", res.data);
    setInquiries(res.data.data || res.data);
    setTotalCount(res.data.totalCount || 0);
  } catch (error) {
    console.error("목록 불러오기 실패", error.response || error);
    setInquiries([]);
    setTotalCount(0);
  }
};




  const handleStatusChange = async (newStatus) => {


    try {
      await axios.patch(
        `http://localhost:8080/api/inquiries/${selected.id}/status`,
        null, // body 없음
        {
          params: { status: newStatus },
         // headers: { Authorization: `Bearer ${token}` },
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

    try {
      const res = await axios.get(`http://localhost:8080/api/inquiries/${inquiry.id}`, 
        // {
        // headers: { Authorization: `Bearer ${token}` },
        // }
    );
      const fullInquiry = res.data;

      if (fullInquiry.status === "ANSWERED") {
        const answerRes = await axios.get(`http://localhost:8080/api/inquiry-answers/${inquiry.id}`, 
          // {
          // headers: { Authorization: `Bearer ${token}` },
          // }
      );
        fullInquiry.answer = answerRes.data.answer;
      }

      setSelected(fullInquiry);
    } catch (err) {
      console.error("문의 상세 조회 실패", err);
      alert("상세 정보를 불러오는 데 실패했습니다.");
    }
  };

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

// 답변 전송
const handleSubmit = async (inquiry) => {
    console.log("inquiry:", inquiry);
  console.log("inquiry.id:", inquiry?.id);
  try {
    const csrfToken = getCookie("XSRF-TOKEN");

    const res = await axios.post(
      "http://localhost:8080/api/inquiry-answers",
      {
        inquiryId: inquiry.id,
        answer: reply,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,  // CSRF 토큰 헤더
        },
        withCredentials: true, // 쿠키 포함 옵션 필수!
      }
    );
    alert("답변이 성공적으로 전송되었습니다.");
    setReply("");        // 답변 입력 초기화
    setSelected(null);   // 모달 닫기 (원하면)

    await fetchInquiries();  // 리스트 최신화
  } catch (error) {
    console.error("답변 전송 실패", error);
    alert("답변 전송 중 오류가 발생했습니다.");
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
          onSubmit={() => handleSubmit(selected)} // 이렇게 'selected' 객체 전달 필요
          onStatusChange={handleStatusChange}
        />
      )}
    </Container>
  );
};

export default InquiriesManagement;
