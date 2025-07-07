// 주문 내역 페이지 (정리된 버전)
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import { useAuth } from '../../../hooks/useAuth';
import Header from '../../../components/Header'; // 🔥 헤더 직접 불러오기
import Footer from '../../../components/Footer'; // 🔥 푸터 직접 불러오기
import { Table, Button, Tag, Spin } from 'antd';

const MyOrderListPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  const getHiddenOrders = () => {
    try {
      return JSON.parse(localStorage.getItem('hiddenOrders')) || [];
    } catch {
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/my');
      const hiddenOrders = getHiddenOrders();
      const visibleOrders = res.data.filter(order => !hiddenOrders.includes(order.id));
      setOrders(visibleOrders);
    } catch (err) {
      console.error(err);
      setError('주문 목록 조회 실패');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isLoggedIn && user?.id) {
      fetchOrders();
    }
  }, [authLoading, isLoggedIn, user]);

  const hideOrder = (orderId) => {
    if (confirm('해당 주문을 목록에서 숨기시겠습니까?')) {
      const hiddenOrders = getHiddenOrders();
      if (!hiddenOrders.includes(orderId)) {
        hiddenOrders.push(orderId);
        localStorage.setItem('hiddenOrders', JSON.stringify(hiddenOrders));
      }
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  if (authLoading || loadingOrders) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }} />;
  }

  if (!isLoggedIn) {
    return <div style={{ textAlign: 'center', marginTop: '150px' }}>로그인 후 주문 내역을 확인할 수 있습니다.</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'crimson', marginTop: '150px' }}>{error}</div>;
  }

  const columns = [
    {
      title: '주문 번호',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <a onClick={() => router.push(`/mypage/orders/${record.id}`)} style={{ color: '#1890ff' }}>
          {text}
        </a>
      ),
    },
    {
      title: '결제 상태',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => (
        status === 'PAID' ? <Tag color="green">결제 완료</Tag> : <Tag color="orange">결제 대기</Tag>
      )
    },
    {
      title: '총 결제 금액',
      dataIndex: 'payAmount',
      key: 'payAmount',
      render: (amount) => `${amount?.toLocaleString()}원`
    },
    {
      title: '주문일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: '관리',
      key: 'action',
      render: (text, record) => (
        <Button
          danger
          onClick={(e) => {
            e.stopPropagation();
            hideOrder(record.id);
          }}
        >
          삭제
        </Button>
      )
    }
  ];

  return (
    <>
      {/* ✅ Header 적용 */}
      <Header />

      {/* ✅ 본문 */}
      <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>나의 주문 내역</h1>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => router.push(`/mypage/orders/${record.id}`),
          })}
        />
      </div>

      {/* ✅ Footer 적용 */}
      <Footer />
    </>
  );
};

export default MyOrderListPage;
