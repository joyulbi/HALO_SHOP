import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InquiriesManagement from "../../components/InquiriesManagement";
import AdminLayout from './AdminLayout'; 

const Container = styled.div`
  width: 70vw;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  margin: 0;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Inquiries = () => {
  const [status, setStatus] = useState("SUBMITTED");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>문의 목록</Title>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="SUBMITTED">접수됨</option>
            <option value="REVIEWING">검토중</option>
            <option value="ANSWERED">답변완료</option>
          </Select>
        </Header>

        <InquiriesManagement status={status} token={token} />
      </Container>
    </AdminLayout>
  );
};

export default Inquiries;
