import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import { useAuth } from '../../../hooks/useAuth';

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${id}`);
      console.log('🚩 주문 상세 데이터:', res.data);
      setOrder(res.data);
    } catch (err) {
      console.error('🚩 주문 상세 조회 오류:', err);
      if (err.response?.status === 403) {
        alert('본인 주문만 조회할 수 없습니다.');
      } else {
        alert('주문 상세 조회 실패');
      }
      router.replace('/mypage/orders/orders');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('결제를 완료 처리하시겠습니까?')) return;
    try {
      await api.post(`/api/payment/mock/approve`, null, { params: { orderId: id } });
      alert('결제가 완료되었습니다.');
      fetchOrder(); // 상태 갱신
    } catch (err) {
      console.error('🚩 결제 승인 오류:', err);
      alert('결제 승인에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!authLoading && isLoggedIn && user?.id && id) {
      fetchOrder();
    }
  }, [authLoading, isLoggedIn, user, id]);

  if (authLoading || loadingOrder) {
    return <div className="p-8 text-center">주문 상세를 불러오는 중...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center">주문 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">주문 상세</h1>

      <div className="border rounded-lg shadow p-6 space-y-3 bg-white">
        <div className="flex justify-between font-semibold text-lg">
          <span>주문 번호:</span>
          <span>{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span>결제 상태:</span>
          <span className={order.paymentStatus === 'PAID' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
            {order.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between">
          <span>총 결제 금액:</span>
          <span>{order.payAmount?.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>주문일:</span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
        {order.orderItems && order.orderItems.length > 0 ? (
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center border rounded-lg shadow p-4 gap-4 bg-white">
                <img
                  src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : '/images/no-image.png'}
                  alt={item.itemName}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.itemName}</h3>
                  <p className="text-sm text-gray-600">
                    {item.productPrice.toLocaleString()}원 x {item.quantity}개
                  </p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    합계: {(item.productPrice * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">주문 상품 정보가 없습니다.</p>
        )}
      </div>

      {order.paymentStatus === 'PENDING' && (
        <div className="mt-8 text-center">
          <button
            onClick={handleApprove}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            결제 완료 처리
          </button>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/admin/order')}
          className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
        >
          주문 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
