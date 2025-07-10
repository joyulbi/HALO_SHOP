// pages/admin/system/index.js
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Table,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Card,
  Badge
} from 'antd';
import moment from 'moment';
import api from '../../../utils/axios';
import styled, { createGlobalStyle } from 'styled-components';

const { Title } = Typography;

export default function SystemAdminPage() {
  const [data, setData] = useState([]);
  const [activeIds, setActiveIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);
  const [pageInfo, setPageInfo] = useState({ current: 0, size: 20, total: 0 });

  const fetchList = async ({ current, size } = pageInfo) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/user/users', {
        params: { page: current, size }
      });
      setData(res.data.content || []);
      setPageInfo(info => ({ ...info, total: res.data.totalElements }));
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

  // 0.5초마다 활성 세션 목록 자동 갱신
  useEffect(() => {
    const iv = setInterval(() => {
      fetchActive();
    }, 500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    fetchList();
    fetchActive();
  }, []);

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
      render: (_, r) =>
        loadingActive ? (
          <Spin size="small" />
        ) : activeIds.has(r.id) ? (
          <Badge status="success" text="Active" />
        ) : (
          <Badge status="default" text="Offline" />
        )
    },
    {
      title: 'Actions',
      key: 'action',
      width: 140,
      render: (_, r) =>
        activeIds.has(r.id) ? (
          <Space>
            <Button size="small" danger onClick={() => handleForceLogout(r.id)}>
              강제 로그아웃
            </Button>
          </Space>
        ) : null
    }
  ];

  return (
    <>
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
      </Wrapper>
    </>
  );
}

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
  background: #fff;
  border-radius: 8px;
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 4rem;
`;
