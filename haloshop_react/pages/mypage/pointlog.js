import React, { useEffect, useState } from 'react';
import { Card, Spin, Typography } from 'antd';
import api from '../../utils/axios';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const UserPointPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchUserPoint = async () => {
      try {
        const res = await api.get(`/api/userpoint/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        console.log('받은 유저 포인트 데이터:', res.data);
        setPointData(res.data);
      } catch (error) {
        console.error('유저 포인트 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPoint();
  }, [user, isLoggedIn]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <Title level={3}>나의 포인트 현황</Title>
      {loading ? (
        <Spin />
      ) : pointData && pointData.totalPoint !== undefined ? (
        <Card>
          <p><Text strong>ID:</Text> {pointData.id}</p>
          <p><Text strong>회원 ID:</Text> {pointData.accountId}</p>
          <p><Text strong>보유 포인트:</Text> {pointData.totalPoint.toLocaleString()}P</p>
          <p><Text strong>총 사용 금액:</Text> {pointData.totalPayment.toLocaleString()}원</p>
          <p><Text strong>회원 등급:</Text> {pointData.grade}</p>
          <p><Text strong>최종 업데이트:</Text> {pointData.updatedAt}</p>
        </Card>
      ) : (
        <Text>포인트 정보를 불러올 수 없습니다.</Text>
      )}
    </div>
  );
};

export default UserPointPage;
