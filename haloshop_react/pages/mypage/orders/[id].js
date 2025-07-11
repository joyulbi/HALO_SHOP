import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import { useAuth } from '../../../hooks/useAuth';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  // 주문 상세 조회
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${id}`);
      console.log('🚩 주문 상세 데이터:', res.data);
      setOrder(res.data);
    } catch (err) {
      console.error('🚩 주문 상세 조회 오류:', err);
      alert(err.response?.status === 403
        ? '본인 주문만 조회할 수 있습니다.'
        : '주문 상세 조회 실패');
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

  const hideOrder = () => {
    if (confirm('이 주문을 목록에서 삭제하시겠습니까?')) {
      const hiddenOrders = JSON.parse(localStorage.getItem('hiddenOrders') || '[]');
      if (!hiddenOrders.includes(order.id)) {
        hiddenOrders.push(order.id);
        localStorage.setItem('hiddenOrders', JSON.stringify(hiddenOrders));
      }
      alert('주문이 삭제되었습니다.');
      router.push('/mypage/orders');
    }
  };

  const requestRefund = () => {
    if (confirm('환불을 요청하시겠습니까? 고객센터 페이지로 이동합니다.')) {
      router.push('/contact');
    }
  };

  if (authLoading || loadingOrder) {
    return <div style={{ padding: '80px 0', textAlign: 'center' }}>주문 상세를 불러오는 중...</div>;
  }

  if (!order) {
    return <div style={{ padding: '80px 0', textAlign: 'center' }}>주문 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <Header />
      <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>주문 상세</h1>

        <div style={{
          border: '1px solid #ddd',
          borderRadius: '16px',
          padding: '30px',
          background: '#fff',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
            <span>주문 번호</span>
            <span>{order.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>결제 상태</span>
            <span style={{
              color: order.paymentStatus === 'PAID' ? '#52c41a' : '#faad14',
              fontWeight: 'bold'
            }}>
              {order.paymentStatus === 'PAID' ? '결제 완료' : '결제 대기'}
            </span>
          </div>
          {order.amount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>사용한 포인트</span>
              <span style={{ color: '#fa541c', fontWeight: 'bold' }}>
                {order.amount?.toLocaleString()}P
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>총 결제 금액</span>
            <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
              {order.payAmount?.toLocaleString()}원
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' }}>
            <span>주문일</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>주문 상품</h2>
        {order.orderItems && order.orderItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {order.orderItems.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '16px',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                {/* ✅ 이미지 경로 표시 부분 */}
                <img
                  src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : '/images/no-image.png'}
                  alt={item.itemName}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '16px'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}>{item.itemName}</h3>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {item.productPrice.toLocaleString()}원 x {item.quantity}개
                  </div>
                  <div style={{ fontSize: '16px', color: '#222', fontWeight: 'bold', marginTop: '4px' }}>
                    합계: {(item.productPrice * item.quantity).toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>주문 상품 정보가 없습니다.</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '80px' }}>
          <button
            onClick={() => router.push('/mypage/orders')}
            style={{
              padding: '12px 32px',
              backgroundColor: '#555',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#555'}
          >
            주문 목록으로 돌아가기
          </button>

          <button
            onClick={hideOrder}
            style={{
              padding: '12px 32px',
              backgroundColor: '#f5222d',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cf1322'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5222d'}
          >
            이 주문 삭제하기
          </button>

          <button
            onClick={requestRefund}
            style={{
              padding: '12px 32px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#096dd9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1890ff'}
          >
            환불 요청
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetailPage;
