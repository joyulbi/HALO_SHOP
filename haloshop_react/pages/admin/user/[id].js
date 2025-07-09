// pages/admin/user/[id].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Descriptions,
  Badge,
  Space,
  Typography
} from 'antd';
import moment from 'moment';
import api from '../../../utils/axios';
import styled, { createGlobalStyle } from 'styled-components';

const { Option } = Select;
const { Text } = Typography;

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [detail, setDetail]   = useState(null);
  const [form]   = Form.useForm();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/admin/user/users/${id}`)
      .then(res => {
        setDetail(res.data);
        form.setFieldsValue({
          email:         res.data.account.email,
          nickname:      res.data.account.nickname,
          phone:         res.data.account.phone,
          address:       res.data.user?.address,
          addressDetail: res.data.user?.addressDetail,
          zipcode:       res.data.user?.zipcode,
          birth:         res.data.user?.birth ? moment(res.data.user.birth) : null,
          gender:        res.data.user?.gender,
          status:        res.data.account.userStatusId,
        });
      })
      .catch(() => {
        message.error('상세 정보를 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // 1) 프로필 수정
      await api.put(`/admin/user/users/${id}`, {
        nickname:      values.nickname,
        email:         values.email,
        phone:         values.phone,
        address:       values.address,
        addressDetail: values.addressDetail,
        zipcode:       String(values.zipcode),
        birth:         values.birth.format('YYYY-MM-DD'),
        gender:        values.gender,
      });
      // 2) 상태 변경
      if (values.status !== detail.account.userStatusId) {
        await api.patch(`/admin/user/users/${id}/status`, {
          id: values.status
        });
      }
      message.success('저장되었습니다.');
      router.push('/admin/user');
    } catch {
      message.error('저장 중 오류가 발생했습니다.');
    }
  };

  if (loading || !detail) {
    return (
      <LoadingWrapper>
        <Spin size="large" />
      </LoadingWrapper>
    );
  }

  const { account, admin } = detail;

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet"/>
      </Head>
      <GlobalStyle/>
      <PageWrapper>
        <StyledCard
          title={
            <Space>
              <BackButton onClick={() => router.back()}>← 뒤로</BackButton>
              <span>유저 상세/수정 (ID: {id})</span>
            </Space>
          }
        >
          {/* 상단 요약 정보 */}
          <Descriptions
            bordered
            column={{ xs: 1, sm: 2 }}
            size="small"
            style={{ marginBottom: 24 }}
          >
            <Descriptions.Item label="이메일">{account.email}</Descriptions.Item>
            <Descriptions.Item label="가입일">{moment(account.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="관리자 여부" span={2}>
              <Badge
                status={account.isAdmin ? 'processing' : 'default'}
                text={account.isAdmin ? '관리자' : '사용자'}
              />
            </Descriptions.Item>
            {admin && (
              <Descriptions.Item label="관리자 역할" span={2}>
                {admin.role}
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* 수정 폼 */}
          <Form form={form} layout="vertical" style={{ maxWidth: 800, margin: '0 auto' }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="이메일"
                  rules={[{ required: true, message: '이메일을 입력하세요.' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="nickname"
                  label="닉네임"
                  rules={[{ required: true, message: '닉네임을 입력하세요.' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="phone" label="전화번호">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="status"
                  label="회원 상태"
                  rules={[{ required: true, message: '상태를 선택하세요.' }]}
                >
                  <Select>
                    <Option value={1}>정상</Option>
                    <Option value={2}>정지</Option>
                    <Option value={3}>휴면</Option>
                    <Option value={4}>탈퇴</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="birth" label="생년월일">
                  <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="gender" label="성별">
                  <Select>
                    <Option value="M">남</Option>
                    <Option value="F">여</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item name="address" label="주소">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="addressDetail" label="상세주소">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="zipcode" label="우편번호">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
              <CancelButton onClick={() => router.back()}>취소</CancelButton>
              <SaveButton type="primary" onClick={handleSave}>저장</SaveButton>
            </Form.Item>
          </Form>
        </StyledCard>
      </PageWrapper>
    </>
  );
}

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    background: #f6f5f3 !important;
    font-family: 'Playfair Display', serif !important;
  }
  .ant-descriptions-bordered .ant-descriptions-item-label {
    font-weight: 600;
  }
`;

// Styled components
const PageWrapper = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  .ant-card-head {
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const BackButton = styled(Button)`
  font-family: 'Playfair Display', serif;
  border: none;
  color: #000;
  &:hover {
    color: #555;
    background: transparent;
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 4rem;
`;

const CancelButton = styled(Button)`
  margin-right: 8px;
  background: #ccc;
  border: none;
  color: #333;
  &:hover {
    background: #bbb;
  }
`;

const SaveButton = styled(Button)`
  background: #b4975a;
  border: none;
  color: #fff;
  &:hover {
    background: #a07e43;
  }
`;
