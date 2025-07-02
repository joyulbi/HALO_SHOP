import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 900px;       /* 기존 700px → 900px */
  min-height: 700px;      /* 세로 길이 추가 */
  margin: 3rem auto;
  padding: 3rem 3rem 4rem 3rem;  /* 위아래 여백 약간 더 크게 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 600;
  width: 120px;
  min-width: 120px;
  color: #444;
`;

const Select = styled.select`
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  &:focus {
    outline: none;
    border-color: #007bff;
    background: #f0f8ff;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: ${({ disabled }) => (disabled ? "#eee" : "white")};
  color: ${({ disabled }) => (disabled ? "#555" : "inherit")};
  &:focus {
    outline: none;
    border-color: #007bff;
    background: ${({ disabled }) => (disabled ? "#eee" : "#f0f8ff")};
  }
`;

const FullWidthInput = styled(Input)`
  width: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #007bff;
    background: #f0f8ff;
  }
`;

const FileInput = styled.input`
  border: none;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.7rem 1.8rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const CATEGORY_LIST = [
  { id: 1, label: "상품 문의" },
  { id: 2, label: "배송 문의" },
  { id: 3, label: "환불 문의" },
  { id: 4, label: "기타" },
];

const InquiryForm = () => {
  const [categoryId, setCategoryId] = useState(1);
  const [userName] = useState("홍길동"); // 하드코딩된 유저 이름 (수정불가)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("account.id", 1); // 하드코딩된 userId
    formData.append("entity.id", categoryId);
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    if (file) {
      formData.append("file", file);
    }
    formData.append("createdAt", new Date().toISOString());
    formData.append("status", "SUBMITTED");

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/inquiries", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("문의가 성공적으로 등록되었습니다.");
      setTitle("");
      setContent("");
      setCategoryId(1);
      setFile(null);
    } catch (error) {
      console.error("문의 등록 실패", error);
      alert("문의 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Row>
          <Label htmlFor="category">카테고리 선택</Label>
          <Select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            disabled={loading}
          >
            {CATEGORY_LIST.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </Select>
        </Row>

        <Row>
          <Label>유저 이름</Label>
          <Input type="text" value={userName} disabled />
        </Row>

        <Row>
          <Label htmlFor="title">문의 제목</Label>
          <FullWidthInput
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문의 제목을 입력하세요"
            disabled={loading}
          />
        </Row>

        <Row>
          <Label htmlFor="content">문의 내용</Label>
          <TextArea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문의 내용을 입력하세요"
            disabled={loading}
          />
        </Row>

        <Row>
          <Label htmlFor="file">파일 선택</Label>
          <FileInput
            id="file"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          {file && <span>{file.name}</span>}
        </Row>

        <ButtonWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? "전송 중..." : "보내기"}
          </Button>
        </ButtonWrapper>
      </form>
    </Container>
  );
};

export default InquiryForm;
