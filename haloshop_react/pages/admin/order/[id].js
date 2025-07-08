import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import { useAuth } from '../../../hooks/useAuth';
import AdminLayout from '../AdminLayout';

const OrderDetailPage = () => {
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
    return <div style={{ padding: '40px', textAlign: 'center' }}>주문 상세를 불러오는 중...</div>;
  }

  if (!order) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>주문 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <AdminLayout>
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
        주문 상세
      </h1>

      <div style={{
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '32px',
  marginBottom: '50px',
  backgroundColor: '#fdfdfd',
  fontSize: '18px',
  lineHeight: '1.8'
}}>
  <p><strong>🧾 주문 번호:</strong> {order.id}</p>
  <p>
    <strong>💳 결제 상태:</strong>{' '}
    <span style={{
      color: order.paymentStatus === 'PAID' ? 'green' : 'orange',
      fontWeight: 'bold'
    }}>
      {order.paymentStatus}
    </span>
  </p>
  <p><strong>💰 총 결제 금액:</strong> {order.payAmount?.toLocaleString()}원</p>
  <p style={{ fontSize: '15px', color: '#666' }}>
    <strong>🕒 주문일:</strong> {new Date(order.createdAt).toLocaleDateString()}
  </p>
</div>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>주문 상품</h2>
      {order.orderItems && order.orderItems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {order.orderItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '16px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              gap: '16px'
            }}>
              <img
                src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : '/images/no-image.png'}
                alt={item.itemName}
                style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{item.itemName}</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>{item.productPrice.toLocaleString()}원 x {item.quantity}개</p>
                <p style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '4px' }}>
                  합계: {(item.productPrice * item.quantity).toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '14px', color: '#999' }}>주문 상품 정보가 없습니다.</p>
      )}

      {order.paymentStatus === 'PENDING' && (
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button
            onClick={handleApprove}
            style={{
              padding: '12px 24px',
              backgroundColor: '#047857',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#065f46'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#047857'}
          >
            결제 완료 처리
          </button>
        </div>
      )}

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          onClick={() => router.push('/admin/order')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#444'}
        >
          주문 목록으로 돌아가기
        </button>
      </div>
    </div>
    </AdminLayout>  
  );
};

export default OrderDetailPage;
