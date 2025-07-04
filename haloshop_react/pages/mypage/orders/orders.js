import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../hooks/useAuth';

const MyOrderListPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/my'); // ✅ 본인 주문 내역 API 호출
      setOrders(res.data);
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

  if (authLoading || loadingOrders) {
    return (
      <Layout>
        <div className="p-4 text-center">주문 내역을 불러오는 중...</div>
      </Layout>
    );
  }

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="p-4 text-center">로그인 후 주문 내역을 확인할 수 있습니다.</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">나의 주문 내역</h1>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">주문 내역이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map(order => (
              <li
                key={order.id}
                className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/mypage/orders/${order.id}`)}
              >
                <div className="font-semibold">주문 번호: {order.id}</div>
                <div>결제 상태: {order.paymentStatus}</div>
                <div>총 결제 금액: {order.payAmount?.toLocaleString()}원</div>
                <div className="text-sm text-gray-600">
                  주문일: {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default MyOrderListPage;
