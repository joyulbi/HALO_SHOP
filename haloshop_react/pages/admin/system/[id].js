import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Descriptions,
  Badge,
  message,
  Space,
  Typography,
  Modal
} from 'antd';
import moment from 'moment';
import api from '../../../utils/axios';
import styled, { createGlobalStyle } from 'styled-components';

const { Option } = Select;
const { Title } = Typography;

export default function AdminDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form] = Form.useForm();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]); // 역할 목록
  const [showRoleModal, setShowRoleModal] = useState(false); // 권한 승격 모달 상태 추가

  // 관리자의 세부 정보를 불러오는 useEffect
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // 관리자 정보 가져오기
    api
      .get(`/admin/user/admin/${id}`)
      .then(res => {
        setDetail(res.data);
        form.setFieldsValue({
          email: res.data.account.email,
          nickname: res.data.account.nickname,
          role: res.data.admin?.role,
          isLocked: res.data.admin?.isLocked ? 'Y' : 'N'
        });
      })
      .catch(() => {
        message.error('관리자 정보를 불러오는 데 실패했습니다.');
      })
      .finally(() => setLoading(false));

    // 역할 목록 가져오기
    api
      .get('/admin/roles')
      .then(res => {
        console.log("DEBUG: Fetched Roles Data (AdminDetailPage):", res.data); // 디버깅 로그 추가
        setRoles(res.data);  // 백엔드에서 제공된 역할 목록 설정
      })
      .catch((error) => { // error 객체를 받아와 로깅하도록 수정
        console.error('DEBUG: 역할 목록 불러오기 실패 (AdminDetailPage):', error); // 디버깅 로그 추가
        message.error('역할 목록을 불러오는 데 실패했습니다.');
      });
  }, [id]);

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await api.put(`/admin/user/admin/${id}`, {
        email: values.email,
        nickname: values.nickname,
        role: parseInt(values.role), // role은 숫자로 변환
        isLocked: values.isLocked === 'Y' // 'Y' -> true, 'N' -> false
      });
      message.success('저장되었습니다.');
      router.push('/admin/system'); // 저장 후 관리자 목록으로 돌아가기
    } catch {
      message.error('저장 중 오류 발생');
    }
  };

  // 삭제 버튼 클릭 시 호출되는 함수
  const handleDelete = async () => {
    try {
      await api.delete(`/admin/user/admin/${id}`);
      message.success('삭제되었습니다.');
      router.push('/admin/system');
    } catch {
      message.error('삭제 중 오류 발생');
    }
  };

  // 권한 승격 처리
  const handleRolePromote = async (roleId) => {
    try {
      await api.post('/admin/promote', {
        targetAccountId: id,
        roleId,
        newPassword: 'temporaryPassword' // 실제 비밀번호는 마스터 관리자가 설정
      });
      message.success('권한 승격이 완료되었습니다.');
      setShowRoleModal(false); // 모달 닫기
    } catch (error) {
      message.error(`권한 승격 실패: ${error.message}`);
    }
  };

  if (loading || !detail) {
    return <LoadingWrapper><Spin size="large" /></LoadingWrapper>;
  }

  const { account, admin } = detail;

  return (
    <>
      <Head>
        <title>관리자 상세</title>
      </Head>
      <GlobalStyle />
      <Wrapper>
        <Title level={3}>관리자 상세/수정 (ID: {id})</Title>

        <Card style={{ marginBottom: 32 }}>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="이메일">{account.email}</Descriptions.Item>
            <Descriptions.Item label="가입일">{moment(account.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="상태">
              <Badge
                status={admin?.isLocked ? 'error' : 'success'}
                text={admin?.isLocked ? '잠금' : '정상'}
              />
            </Descriptions.Item>
            {admin && (
              <Descriptions.Item label="역할">{admin.role}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        <Card>
          <Form layout="vertical" form={form} style={{ maxWidth: 600, margin: '0 auto' }}>
            <Form.Item
              name="email"
              label="이메일"
              rules={[{ required: true, message: '이메일을 입력하세요.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nickname"
              label="닉네임"
              rules={[{ required: true, message: '닉네임을 입력하세요.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="역할"
              rules={[{ required: true, message: '역할을 선택하세요.' }]}
            >
              <Select>
                {roles.map(role => (
                  <Option key={role.roleId} value={role.roleId}>
                    {role.description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="isLocked" label="잠금 여부">
              <Select defaultValue={admin?.isLocked ? 'Y' : 'N'}>
                <Option value="N">정상</Option>
                <Option value="Y">잠금</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button onClick={() => router.back()} style={{ marginRight: 8 }}>취소</Button>
              <Button danger onClick={handleDelete} style={{ marginRight: 8 }}>삭제</Button>
              <Button type="primary" onClick={handleSave}>저장</Button>
            </Form.Item>
            {/* 권한 승격 버튼 */}
            <Form.Item>
              <Button
                type="default"
                style={{ width: '100%' }}
                onClick={() => setShowRoleModal(true)}
              >
                권한 승격
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 권한 승격 모달 */}
        <Modal
          title="권한 승격"
          visible={showRoleModal}
          onCancel={() => setShowRoleModal(false)}
          footer={null}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {roles.map(role => (
              <Button
                key={role.roleId}
                type="default"
                block
                onClick={() => handleRolePromote(role.roleId)} // 해당 역할로 승격
              >
                {role.description}
              </Button>
            ))}
          </Space>
        </Modal>
      </Wrapper>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    background: #f4f4f4 !important;
    font-family: 'Noto Sans KR', sans-serif !important;
  }
`;

const Wrapper = styled.div`
  max-width: 960px;
  margin: 40px auto;
  padding: 24px;
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 4rem;
`;
