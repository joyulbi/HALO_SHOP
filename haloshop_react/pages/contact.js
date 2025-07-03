import React, { useState } from "react";
import styled from "styled-components";
import InquiryForm from "../components/InquiryForm"; // 기존 ContactForm → InquiryForm
import InquiryList from "../components/InquiryList";

// 예시 사용자 정보
const mockUser = {
  id: 1,
  name: "홍길동",
  email: "gildong@example.com",
};

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;  // 화면 전체 높이 유지
  background: #fafafa;
`;

const Sidebar = styled.div`
  width: 220px;  // 약간 넓게
  background-color: #f0f0f0;
  padding: 2rem 1.5rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
`;

const TabButton = styled.button`
  width: 100%;
  background: ${({ active }) => (active ? "#007bff" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  border: none;
  padding: 1rem;
  text-align: left;
  font-size: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;

  &:hover {
    background: ${({ active }) => (active ? "#0056b3" : "#e2e6ea")};
  }
`;

const Main = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 100vh;
  box-sizing: border-box;
`;

const contact = ({ user = mockUser }) => {
  const [selectedTab, setSelectedTab] = useState("write");

  return (
    <Wrapper>
      <Sidebar>
        <TabButton
          active={selectedTab === "write"}
          onClick={() => setSelectedTab("write")}
        >
          문의 작성
        </TabButton>
        <TabButton
          active={selectedTab === "list"}
          onClick={() => setSelectedTab("list")}
        >
          문의 내역
        </TabButton>
      </Sidebar>
      <Main>
        {selectedTab === "write" && <InquiryForm user={user} />}
        {selectedTab === "list" && <InquiryList user={user} />}
      </Main>
    </Wrapper>
  );
};

export default contact;
