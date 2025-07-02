import React, { useState } from "react";
import styled from "styled-components";
import ContactForm from "../components/ContactForm";
import InquiryList from "../components/InquiryList";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #f0f0f0;
  padding: 2rem 1rem;
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
  padding: 2rem;
  overflow-y: auto;
`;

const contact = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState("write"); // "write" or "list"

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
        {selectedTab === "write" && <ContactForm />}
        {selectedTab === "list" && <InquiryList />}
      </Main>
    </Wrapper>
  );
};

export default contact;
