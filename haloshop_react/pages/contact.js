import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import InquiryForm from "../components/InquiryForm";
import InquiryHistory from "../components/InquiryHistory";

const Wrapper = styled.div`
  width: 60vw;
  margin: 0 auto;
  min-height: 100vh;
  background: #fafafa;
  padding: 2.5rem 1.5rem 3rem 1.5rem;
  display: flex;
  flex-direction: column;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2.2rem;
`;

const TabButton = styled.button`
  flex: 1;
  background: ${({ active }) => (active ? "#6366f1" : "#f3f4f6")};
  color: ${({ active }) => (active ? "#fff" : "#22223b")};
  border: none;
  border-radius: 8px 8px 0 0;
  padding: 1.1rem 0;
  font-size: 1.13rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  box-shadow: ${({ active }) => (active ? "0 2px 8px rgba(99,102,241,0.08)" : "none")};
  &:hover {
    background: #6366f1;
    color: #fff;
  }
`;

const MainPanel = styled.div`
  background: #fff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(30,41,59,0.07);
  padding: 2.5rem 2rem 2.5rem 2rem;
  min-height: 500px;
`;

const contact = () => {

  const router = useRouter(); // ✅ Next.js 라우터 훅
  const [selectedTab, setSelectedTab] = useState("write");

  // 쿼리 파라미터는 useRouter().query 에 있음 (CSR 환경에서만 접근 가능)
  useEffect(() => {
    if (!router.isReady) return; // 쿼리 파라미터 준비될 때까지 대기
    const tab = router.query.selectedTab;
    if (tab === "list" || tab === "write") {
      setSelectedTab(tab);
    }
  }, [router.isReady, router.query.selectedTab]);

  return (
    <Wrapper>
      <TabBar>
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
      </TabBar>
      <MainPanel>
        {selectedTab === "write" && <InquiryForm onSuccess={() => setSelectedTab("list")} />}
        {selectedTab === "list" && <InquiryHistory />}
      </MainPanel>
    </Wrapper>
  );
};

export default contact;