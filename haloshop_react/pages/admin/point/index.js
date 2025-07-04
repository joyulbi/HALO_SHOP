// ✅ /pages/admin/user-point/index.js
import React, { useEffect, useState } from 'react';
import { Table, Spin, Typography, message } from 'antd';
import api from '../../../utils/axios';

const { Title } = Typography;

const AdminUserPointListPage = () => {
  const [userPoints, setUserPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const res = await api.get('/api/userpoint', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        console.log('관리자용 전체 유저 포인트 리스트:', res.data);
        setUserPoints(res.data);
      } catch (error) {
        console.error('유저 포인트 전체 조회 실패:', error);
        message.error('유저 포인트 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserPoints();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '회원 ID', dataIndex: 'accountId', key: 'accountId' },
    { title: '보유 포인트', dataIndex: 'totalPoint', key: 'totalPoint', render: (text) => `${text.toLocaleString()}P` },
    { title: '총 사용 금액', dataIndex: 'totalPayment', key: 'totalPayment', render: (text) => `${text.toLocaleString()}원` },
    { title: '회원 등급', dataIndex: 'grade', key: 'grade' },
    { title: '최종 업데이트', dataIndex: 'updatedAt', key: 'updatedAt' },
  ];

  return (
    <div className="p-4">
      <Title level={3}>회원별 포인트 전체 조회 (관리자용)</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={userPoints}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      )}
    </div>
  );
};

export default AdminUserPointListPage;
