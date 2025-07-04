import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../hooks/useAuth';

const MyOrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert('본인 주문만 조회할 수 있습니다.');
      } else {
        alert('주문 상세 조회 실패');
      }
      router.replace('/mypage/orders');
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isLoggedIn && user?.id && id) {
      fetchOrder();
    }
  }, [authLoading, isLoggedIn, user, id]);

  if (authLoading || loadingOrder) {
    return (
      <Layout>
        <div className="p-4 text-center">주문 상세를 불러오는 중...</div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="p-4 text-center">주문 데이터를 찾을 수 없습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">주문 상세</h1>
        <div className="border p-4 rounded shadow space-y-2">
          <div className="font-semibold">주문 번호: {order.id}</div>
          <div>결제 상태: {order.paymentStatus}</div>
          <div>총 결제 금액: {order.payAmount?.toLocaleString()}원</div>
          <div className="text-sm text-gray-600">
            주문일: {new Date(order.createdAt).toLocaleDateString()}
          </div>

          <div className="mt-4">
            <h2 className="font-semibold mb-2">주문 상품 목록</h2>
            {order.orderItems && order.orderItems.length > 0 ? (
              <ul className="space-y-2">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="p-2 border rounded">
                    <div className="font-medium">{item.itemName}</div>
                    <div className="text-sm text-gray-700">
                      {item.productPrice.toLocaleString()}원 x {item.quantity}개
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">주문 상품 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyOrderDetailPage;
