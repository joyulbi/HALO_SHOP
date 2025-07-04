import React from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #f7f7f7;
  padding: 0.75rem;
  text-align: left;
  font-size: 0.95rem;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
`;

const Button = styled.button`
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
`;

const Status = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case "SUBMITTED":
        return "#6c757d";
      case "REVIEWING":
        return "#ffc107";
      case "ANSWERED":
        return "#28a745";
      default:
        return "#999";
    }
  }};
`;

const getStatusLabel = (status) => {
  switch (status) {
    case "SUBMITTED":
      return "접수됨";
    case "REVIEWING":
      return "검토중";
    case "ANSWERED":
      return "답변완료";
    default:
      return status;
  }
};

const InquiryTable = ({ inquiries, onSelect }) => (
  <Table>
    <thead>
      <tr>
        <Th>번호</Th>
        <Th>제목</Th>
        <Th>작성자</Th>
        <Th>카테고리</Th>
        <Th>상태</Th>
        <Th>관리</Th>
      </tr>
    </thead>
    <tbody>
      {inquiries.map((inq) => (
        <tr key={inq.id}>
          <Td>{inq.id}</Td>
          <Td>{inq.title}</Td>
          <Td>{inq.accountName || "익명"}</Td>
          <Td>{inq.categoryName}</Td>
          <Td>
            <Status status={inq.status}>{getStatusLabel(inq.status)}</Status>
          </Td>
          <Td>
            <Button onClick={() => onSelect(inq)}>상세보기</Button>
          </Td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default InquiryTable;
