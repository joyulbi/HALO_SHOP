import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../../../hooks/useAuth';
import AdminLayout from '../AdminLayout';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  message,
  Typography,
  Card,
  Badge,
  Space
} from 'antd';
import moment from 'moment';
import api from '../../../utils/axios';
import styled, { createGlobalStyle } from 'styled-components';

const { Title } = Typography;
const { Option } = Select;


const STATUS_MAP = {
  1: { text: '정상', color: '#7db93b' },
  2: { text: '정지', color: '#d4380d' },
  3: { text: '휴면', color: '#faad14' },
  4: { text: '탈퇴', color: '#8c8c8c' },
};

const SystemAdminPage = () => {
  const { user } = useAuth();
const currentAdminId = user?.id || user?.accountId;
  const [data, setData] = useState([]);
  const [activeIds, setActiveIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);
  const [pageInfo, setPageInfo] = useState({ current: 0, size: 20, total: 0 });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [roles, setRoles] = useState([
    { roleId: 0, description: '마스터 관리자' },
    { roleId: 200, description: '상품 관리자' },
    { roleId: 300, description: '멤버십 관리자' },
    { roleId: 400, description: '리뷰 관리자' },
    { roleId: 500, description: '보안 관리자' },
    { roleId: 1000, description: '일반 사용자' }
  ]);

  const fetchList = async ({ current, size } = pageInfo) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/user/list', {
        params: { page: current, size }
      });
      setData(res.data || []);
      setPageInfo(info => ({ ...info, total: res.data.length }));
    } catch {
      message.error('유저 목록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchActive = async () => {
    setLoadingActive(true);
    try {
      const res = await api.get('/admin/active-sessions');
      setActiveIds(new Set(res.data));
    } catch {
      message.error('활성 세션 조회 실패했습니다.');
    } finally {
      setLoadingActive(false);
    }
  };

  const handleForceLogout = async accountId => {
    try {
      await api.post('/admin/session/force-logout', null, {
        params: { accountId }
      });
      message.success(`Account ${accountId} 세션을 강제 로그아웃했습니다.`);
      fetchActive();
    } catch {
      message.error('강제 로그아웃 실패했습니다.');
    }
  };

  const openEditModal = async admin => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/user/admin/${admin.id}`);
      setSelectedAdmin(res.data);
      form.setFieldsValue({
        email: res.data.account.email,
        nickname: res.data.account.nickname
      });
      setModalVisible(true);
    } catch {
      message.error('관리자 상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedAdmin) return;
    const id = selectedAdmin.account.id;
    try {
      await api.post(`/admin/user/status/${id}`, null, {
        params: { statusId: selectedStatus }
      });
      message.success('유저 상태가 변경되었습니다.');
      setModalVisible(false);
      fetchList(pageInfo);
    } catch (err) {
      message.error(err.response?.data || '상태 변경 중 오류가 발생했습니다.');
    }
  };

const handleRolePromote = async ({ password, role }) => {
  if (!selectedAdmin?.account?.id || !selectedAdmin?.account?.email) {
    message.error('유효하지 않은 대상 관리자입니다.');
    return;
  }

  try {
    const response = await api.post('/admin/promote', {
      targetAccountId: selectedAdmin.account.id,
      roleId: role,
      newPassword: password,
      email: selectedAdmin.account.email,
      lastIp: '127.0.0.1',
      assignedBy: currentAdminId,
    });
    message.success(response.data || '권한 승격 완료');
    setRoleModalVisible(false);
    fetchList(pageInfo);
  } catch (error) {
    console.error('승격 오류:', error);
    message.error(error.response?.data || '권한 승격에 실패했습니다.');
  }
};



const openRoleModal = async (admin) => {
  try {
    const res = await api.get(`/admin/user/admin/${admin.id}`);
    setSelectedAdmin(res.data); // account 포함된 구조 전체 주입
    setRoleModalVisible(true);
    roleForm.resetFields();
  } catch (error) {
    message.error('권한 승격용 상세 정보 로딩 실패');
  }
};

// v폴링 1초마다
  useEffect(() => {
    fetchList();
    fetchActive();
    const iv = setInterval(() => {
      fetchActive();
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
    { title: 'Nickname', dataIndex: 'nickname', key: 'nickname', width: 140 },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: d => moment(d).format('YY.MM.DD')
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 100,
      render: a => (a ? 'Admin' : 'User')
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, r) => {
        const status = STATUS_MAP[r.userStatusId];
        return <Badge color={status.color} text={status.text} />;
      }
    },
    {
      title: '활동 상태',
      key: 'activityStatus',
      width: 160,
      render: (_, r) => {
        return loadingActive ? (
          <Spin size="small" />
        ) : activeIds.has(r.id) ? (
          <Badge status="success" text="Online" />
        ) : (
          <Badge status="default" text="Offline" />
        );
      }
    },
    {
      title: 'Actions',
      key: 'action',
      width: 200,
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(r)}>
            수정
          </Button>
          <Button size="small" onClick={() => openRoleModal(r)}>
            권한 승격
          </Button>
          {activeIds.has(r.id) && (
            <Button size="small" danger onClick={() => handleForceLogout(r.id)}>
              강제 로그아웃
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <AdminLayout>
      <Head>
        <title>시스템 관리자</title>
      </Head>
      <GlobalStyle />
      <Wrapper>
        <Title level={3}>시스템 관리자 페이지</Title>
        <Card bordered={false}>
          {loading ? (
            <LoadingWrapper>
              <Spin size="large" />
            </LoadingWrapper>
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              pagination={{
                current: pageInfo.current + 1,
                pageSize: pageInfo.size,
                total: pageInfo.total,
                showSizeChanger: true
              }}
              onChange={({ current, pageSize }) => {
                const next = {
                  current: current - 1,
                  size: pageSize,
                  total: pageInfo.total
                };
                setPageInfo(next);
                fetchList(next);
              }}
            />
          )}
        </Card>

        <Modal
          visible={modalVisible}
          title="관리자 정보 수정"
          onCancel={() => setModalVisible(false)}
          onOk={handleStatusChange}
          okText="상태 변경"
          cancelText="취소"
          footer={
            <Space>
              <Button onClick={() => setModalVisible(false)}>취소</Button>
              <Button type="primary" onClick={handleStatusChange}>
                상태 변경
              </Button>
            </Space>
          }
        >
          {detailLoading ? (
            <Spin size="large" />
          ) : (
            <Form layout="vertical" form={form} preserve={false}>
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
              <Form.Item name="status" label="회원 상태" rules={[{ required: true, message: '상태를 선택하세요.' }]}> 
                <Select onChange={value => setSelectedStatus(value)} defaultValue={selectedAdmin?.account?.userStatusId}>
                  <Option value={1}>정상</Option>
                  <Option value={2}>정지</Option>
                  <Option value={3}>휴면</Option>
                  <Option value={4}>탈퇴</Option>
                </Select>
              </Form.Item>
            </Form>
          )}
        </Modal>

        <Modal
          title="권한 승격"
          visible={roleModalVisible}
          onCancel={() => setRoleModalVisible(false)}
          footer={null}
          style={{ maxWidth: '500px', margin: 'auto' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form
              form={roleForm}
              name="rolePromoteForm"
              onFinish={handleRolePromote}
              layout="vertical"
            >
              <Form.Item
                name="password"
                label="새 비밀번호"
                rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}
              >
                <Input.Password placeholder="새 비밀번호 입력" />
              </Form.Item>
              <Form.Item
                name="role"
                label="관리자 역할"
                rules={[{ required: true, message: '역할을 선택하세요.' }]}
              >
                <Select placeholder="관리자 역할을 선택하세요">
                  {roles.map(role => (
                    <Option key={role.roleId} value={role.roleId}>
                      {role.description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" block htmlType="submit" style={{ borderRadius: '8px' }}>
                  승격 처리
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Modal>
      </Wrapper>
    </AdminLayout>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    background: #fafafa !important;
    font-family: 'Noto Sans KR', sans-serif !important;
  }
`;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 24px;
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 4rem;
`;

export default SystemAdminPage;
