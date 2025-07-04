import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const InquiryItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
`;

const ContactForm = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/contact/user/`)
      .then((res) => setInquiries(res.data))
      .catch((err) => console.error("문의 내역 로딩 실패", err));
  }, []);

  if (inquiries.length === 0) {
    return <p>문의 내역이 없습니다.</p>;
  }

  return (
    <div>
      <h3>나의 문의 내역</h3>
      {inquiries.map((item) => (
        <InquiryItem key={item.id}>
          <strong>{item.subject}</strong>
          <p>{item.message}</p>
          <small>{new Date(item.createdAt).toLocaleString()}</small>
        </InquiryItem>
      ))}
    </div>
  );
};

export default ContactForm;
