import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Input } from 'antd';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';

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
        console.log('받은 데이터:', res.data);
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
    { title: '유형', dataIndex: 'type', key: 'type' },
    { title: '금액', dataIndex: 'amount', key: 'amount' },
    { title: '일시', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  return (
    <div className="p-4">
      <h2>전체 포인트 로그 (어드민)</h2>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="회원 ID 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleUserFilter}>회원별 조회</Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={logs}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AdminPointLogPage;
