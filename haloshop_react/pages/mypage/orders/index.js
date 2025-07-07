import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import { useAuth } from '../../../hooks/useAuth';

const MyOrderListPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  // 🚩 숨김 처리된 주문 ID 로드
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

  // 🚩 주문 숨기기
  const hideOrder = (e, orderId) => {
    e.stopPropagation(); // 상세 페이지 이동 방지
    if (confirm('해당 주문을 목록에서 숨기시겠습니까?')) {
      const hiddenOrders = getHiddenOrders();
      if (!hiddenOrders.includes(orderId)) {
        hiddenOrders.push(orderId);
        localStorage.setItem('hiddenOrders', JSON.stringify(hiddenOrders));
      }
      // 즉시 화면 반영
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  if (authLoading || loadingOrders) {
    return <div className="p-4 text-center">주문 내역을 불러오는 중...</div>;
  }

  if (!isLoggedIn) {
    return <div className="p-4 text-center">로그인 후 주문 내역을 확인할 수 있습니다.</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">나의 주문 내역</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">주문 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map(order => (
            <li
              key={order.id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50 relative"
              onClick={() => router.push(`/mypage/orders/${order.id}`)}
            >
              <div className="font-semibold">주문 번호: {order.id}</div>
              <div>결제 상태: {order.paymentStatus}</div>
              <div>총 결제 금액: {order.payAmount?.toLocaleString()}원</div>
              <div className="text-sm text-gray-600">
                주문일: {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <button
                onClick={(e) => hideOrder(e, order.id)}
                className="absolute top-2 right-2 text-xs bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
              >
                삭제하기
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrderListPage;
