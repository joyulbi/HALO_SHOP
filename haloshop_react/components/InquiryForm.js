import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Input, Button, Select, Upload, Typography, Row, Col, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CATEGORY_LIST = [
  { id: 101, label: "상품 문의" },
  { id: 102, label: "경매 문의" },
  { id: 103, label: "결제 문의" },
  { id: 104, label: "배송 문의" },
  { id: 105, label: "계정 문의" },
  { id: 106, label: "기타 문의" },
];

const PageBackground = styled.div`
  min-height: 100vh;
  background: #f4f6fa;
  padding: 0;
`;

const PageContainer = styled.div`
  width: 50vw;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 2.5rem 1.5rem;
`;

const StyledFormWrapper = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 2.5rem 2rem 2rem 2rem;
  box-shadow: 0 2px 12px rgba(30, 41, 59, 0.06);
`;

const StyledTitle = styled(Title)`
  && {
    font-weight: 800;
    margin-bottom: 32px;
    letter-spacing: -1px;
    color: #22223b;
  }
`;

const FileName = styled.div`
  margin-top: 8px;
  color: #2563eb;
  font-weight: 500;
`;

const StyledButton = styled(Button)`
  min-width: 100px;
  padding: 0 24px;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  margin-top: 10px;
`;

const InquiryForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 토큰이 있어야 호출 가능
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("로그인이 필요합니다.");
      return;
    }

    axios.get("http://localhost:8080/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => message.error("사용자 정보를 불러올 수 없습니다."));
  }, []);

  const handleFinish = async (values) => {
    if (!user?.account?.id) {
      message.error("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const inquiryData = {
        accountId: user.account.id,
        entityId: values.category,
        title: values.title,
        content: values.content,
        status: "SUBMITTED",
        createdAt: new Date().toISOString(),
        file: null,
      };
      formData.append(
        "inquiry",
        new Blob([JSON.stringify(inquiryData)], { type: "application/json" })
      );
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }
      await axios.post("http://localhost:8080/api/inquiries", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      message.success("문의가 성공적으로 등록되었습니다.");
      form.resetFields();
      setFileList([]);

      if (typeof onSuccess === "function") {
        onSuccess();  // 탭 전환 콜백 호출
      }
    } catch (error) {
      message.error("문의 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

    const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1));
  };

  return (
    <PageBackground>
      <PageContainer>
        <StyledTitle level={2}>문의 등록</StyledTitle>
        <StyledFormWrapper>
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="카테고리"
                  name="category"
                  initialValue={CATEGORY_LIST[0].id}
                  rules={[{ required: true, message: "카테고리를 선택하세요." }]}
                >
                  <Select disabled={loading}>
                    {CATEGORY_LIST.map((cat) => (
                      <Option key={cat.id} value={cat.id}>{cat.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="유저 이름">
                  <Input value={user?.account?.nickname || ""} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="문의 제목"
              name="title"
              rules={[{ required: true, message: "제목을 입력하세요." }]}
            >
              <Input placeholder="문의 제목을 입력하세요" disabled={loading} />
            </Form.Item>

            <Form.Item
              label="문의 내용"
              name="content"
              rules={[{ required: true, message: "내용을 입력하세요." }]}
            >
              <TextArea rows={6} placeholder="문의 내용을 입력하세요" disabled={loading} />
            </Form.Item>

            <Form.Item label="파일 첨부 (선택)">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleFileChange}
                disabled={loading}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.pdf"
              >
                <Button icon={<UploadOutlined />}>파일 업로드</Button>
              </Upload>
              {fileList.length > 0 && (
                <FileName>{fileList[0].name}</FileName>
              )}
            </Form.Item>

            <Form.Item style={{ textAlign: "right" }}>
              <StyledButton
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                보내기
              </StyledButton>
            </Form.Item>
          </Form>
        </StyledFormWrapper>
      </PageContainer>
    </PageBackground>
  );
};

export default InquiryForm;
