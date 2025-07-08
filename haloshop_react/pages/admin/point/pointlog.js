import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Input, Typography, Space, Tag, Empty } from 'antd';
import { useRouter } from 'next/router';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../../utils/axios';
import dayjs from 'dayjs';
import AdminLayout from '../AdminLayout';

const { Title } = Typography;

const typeColorMap = {
  SAVE: 'green',
  USE: 'volcano',
  EXPIRE: 'default',
};

const AdminPointLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/api/pointlog', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setLogs(res.data.data ?? res.data);
      } catch (error) {
        console.error('포인트 로그 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleUserFilter = () => {
    if (userId.trim()) {
      router.push(`/admin/point/${userId.trim()}`);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '사용자 ID', dataIndex: 'accountId', key: 'accountId' },
    {
      title: '유형',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={typeColorMap[type] || 'blue'} key={type}>
          {type}
        </Tag>
      ),
    },
    { title: '금액', dataIndex: 'amount', key: 'amount' },
    {
      title: '일시',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <AdminLayout>
    <div
      style={{
        maxWidth: 960,
        margin: '40px auto',
        padding: '32px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
        fontFamily: 'Noto Sans KR, sans-serif',
      }}
    >
      <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
        🧾 전체 포인트 로그 (관리자)
      </Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 24,
          gap: '12px',
        }}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="회원 ID 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: 220 }}
          allowClear
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleUserFilter}
        >
          회원별 조회
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : logs.length === 0 ? (
        <Empty description="포인트 로그가 없습니다." />
      ) : (
        <Table
          dataSource={logs}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminPointLogPage;
