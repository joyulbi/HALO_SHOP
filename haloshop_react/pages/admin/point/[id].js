import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Spin, Typography, message, Button, Input, Space, Select } from 'antd';
import api from '../../../utils/axios';

const { Title, Text } = Typography;

const AdminUserPointDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPoint, setEditPoint] = useState('');
  const [adjustType, setAdjustType] = useState('수동입력');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchUserPoint = async () => {
      try {
        const res = await api.get(`/api/userpoint/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setPointData(res.data);
      } catch (error) {
        console.error('유저 포인트 상세 조회 실패:', error);
        message.error('유저 포인트 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserPoint();
  }, [router.isReady, id]);

  const handleUpdatePoint = async () => {
    if (!editPoint || isNaN(editPoint)) {
      message.error('유효한 숫자를 입력하세요.');
      return;
    }
    setUpdating(true);
    try {
      // ✅ Query Parameter 방식으로 adjustAmount, adjustType 전달
      await api.post(
        `/api/userpoint/${id}/adjust?adjustAmount=${Number(editPoint)}&adjustType=${encodeURIComponent(adjustType)}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      message.success('포인트가 성공적으로 수정되었습니다.');
      setPointData({ ...pointData, totalPoint: Number(editPoint) });
      setEditPoint('');
    } catch (error) {
      console.error('포인트 수정 실패:', error);
      message.error('포인트 수정에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Title level={3}>회원별 포인트 상세 조회 (관리자용)</Title>
      <Button onClick={() => router.back()} className="mb-4">뒤로가기</Button>
      {loading ? (
        <Spin />
      ) : pointData ? (
        <Card>
          <p><Text strong>ID:</Text> {pointData.id}</p>
          <p><Text strong>회원 ID:</Text> {pointData.accountId}</p>
          <p><Text strong>보유 포인트:</Text> {pointData.totalPoint?.toLocaleString()}P</p>
          <p><Text strong>총 사용 금액:</Text> {pointData.totalPayment?.toLocaleString()}원</p>
          <p><Text strong>회원 등급:</Text> {pointData.grade}</p>
          <p><Text strong>최종 업데이트:</Text> {pointData.updatedAt}</p>

          <Space direction="vertical" style={{ marginTop: '1rem', width: '100%' }}>
            <Input
              placeholder="수정할 포인트 입력"
              value={editPoint}
              onChange={(e) => setEditPoint(e.target.value)}
              disabled={updating}
            />
            <Select
              value={adjustType}
              onChange={setAdjustType}
              disabled={updating}
              style={{ width: '100%' }}
            >
              <Select.Option value="수동입력">수동입력</Select.Option>
              <Select.Option value="이벤트지급">이벤트지급</Select.Option>
              <Select.Option value="벌점차감">벌점차감</Select.Option>
            </Select>
            <Button type="primary" onClick={handleUpdatePoint} loading={updating}>
              포인트 수정
            </Button>
          </Space>
        </Card>
      ) : (
        <Text>유저 포인트 정보를 불러올 수 없습니다.</Text>
      )}
    </div>
  );
};

export default AdminUserPointDetailPage;
