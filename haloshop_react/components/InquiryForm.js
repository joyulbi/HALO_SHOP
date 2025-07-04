import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  height: 100%;

  padding: 3rem 3rem 4rem 3rem;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Row = styled.div`
  display: flex;
  gap: 3rem;
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
  min-height: 240px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  &:focus {
    outline: none;
    background: #ddd;
  }
`;

const FileInput = styled.input`
  border: none;
  padding: 0;
`;


const FieldGroup = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
    const file = e.target.files?.[0];

    // 1. 용량 제한
    if (file && file.size > 5 * 1024 * 1024) {
      alert("파일은 5MB 이하만 가능합니다.");
      return;
    }

    // 2. 타입 제한
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (file && !allowedTypes.includes(file.type)) {
      alert("jpg, png, pdf만 업로드할 수 있습니다.");
      return;
    }

    setFile(file);
  };

  const formData = new FormData();
  formData.append("accountId", 1);
  formData.append("entityId", 1);
  formData.append("title", title);
  formData.append("content", content);
  formData.append("status", "SUBMITTED");
  formData.append("createdAt", new Date().toISOString());

  if (file) { formData.append("file", file); }

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title.trim() || !content.trim()) {
    alert("제목과 내용을 입력해주세요.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    // inquiry 파트에 JSON Blob으로 넣기
    const inquiryData = {
      accountId: 1,       // 예시 하드코딩 or 상태값
      entityId: categoryId,  // 카테고리 id를 entityId로 사용한다고 가정
      title,
      content,
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
      file: null // 서버에서 파일명은 파일 업로드 후 처리하므로 null로 둠
    };

    formData.append(
      "inquiry",
      new Blob([JSON.stringify(inquiryData)], { type: "application/json" })
    );

    if (file) {
      formData.append("file", file);
    }

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
  <FieldGroup>
    <Label htmlFor="category">카테고리</Label>
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
  </FieldGroup>

  <FieldGroup>
    <Label>유저 이름</Label>
    <Input type="text" value={userName} disabled />
  </FieldGroup>
</Row>

        <Row>

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
