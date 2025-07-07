// pages/order/OrderFormPage/index.js

import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

const OrderFormPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [point, setPoint] = useState('');
  const [appliedPoint, setAppliedPoint] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const router = useRouter();

  const { user, isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    api.get('/api/cart')
      .then(res => setCartItems(res.data))
      .catch(err => console.error('장바구니 불러오기 실패:', err));
  }, []);

  const handlePayNow = async () => {
    if (!user?.id) {
      alert('로그인 후 이용해 주세요.');
      router.push('/login');
      return;
    }

    try {
      const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const payAmount = totalPrice - appliedPoint;

      if (paymentMethod === 'KAKAOPAY') {
        const res = await api.post('/api/payment/ready', {
          totalPrice,
          payAmount,
          amount: appliedPoint,
          used: paymentMethod,
          paymentStatus: "PENDING",
          accountId: user.id
        });
        if (res.data.next_redirect_pc_url) {
          window.location.href = res.data.next_redirect_pc_url;
        } else {
          alert('카카오페이 결제 URL을 받아오지 못했습니다.');
        }
      } else {
        const payload = {
          totalPrice,
          payAmount,
          amount: appliedPoint,
          used: paymentMethod,
          paymentStatus: "PENDING",
          accountId: user.id,
          orderItems: cartItems.map(item => ({
            itemId: item.itemId,
            itemName: item.name,
            productPrice: item.price,
            quantity: item.quantity
          }))
        };

        const res = await api.post('/api/orders', payload);
        alert('주문이 완료되었습니다!');
        router.push(`/mypage/orders/${res.data.orderId}`);
      }
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  const handleApplyPoint = () => {
    const pointValue = parseInt(point, 10) || 0;
    if (pointValue < 0) {
      alert('0 이상의 값을 입력하세요.');
      return;
    }
    if (pointValue > totalPrice) {
      alert('결제 금액을 초과하는 포인트는 사용할 수 없습니다.');
      setAppliedPoint(totalPrice);
      return;
    }
    setAppliedPoint(pointValue);
    alert(`${pointValue.toLocaleString()} 포인트가 적용되었습니다.`);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalPrice = totalPrice - appliedPoint;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '40px',
        textAlign: 'center',
        color: '#222'
      }}>
        주문서 작성
      </h1>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>주문할 상품이 없습니다.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              backgroundColor: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                  src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : '/images/no-image.png'}
                  alt={item.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <div>
                  <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>{item.name}</h3>
                  <p style={{ color: '#c8102e', fontWeight: 'bold', fontSize: '18px' }}>{item.price.toLocaleString()}원</p>
                  <p style={{ color: '#555' }}>수량: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}

          <div style={{
            padding: '30px',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            marginTop: '40px',
            backgroundColor: '#fafafa',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>결제 요약</h3>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>상품 금액: {totalPrice.toLocaleString()}원</p>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>포인트 사용: {appliedPoint.toLocaleString()}원</p>
            <p style={{ fontWeight: 'bold', color: '#c8102e', fontSize: '20px', marginTop: '16px' }}>
              총 결제 금액: {finalPrice.toLocaleString()}원
            </p>

            <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="text"
                placeholder="사용할 포인트 입력"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                style={{
                  padding: '12px',
                  width: '220px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
              <button onClick={handleApplyPoint} style={applyButtonStyle}>포인트 적용</button>
            </div>

            <div style={{ marginTop: '30px' }}>
              <label style={{ marginRight: '10px', fontSize: '16px' }}>결제 수단 선택:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
              >
                <option value="CARD">카드 결제</option>
                <option value="KAKAOPAY">카카오페이</option>
              </select>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
              <button onClick={() => router.push('/cart')} style={cancelButtonStyle}>취소</button>
              <button onClick={handlePayNow} style={checkoutButtonStyle}>결제하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const applyButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#c8102e',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  fontWeight: 'bold'
};

const cancelButtonStyle = {
  padding: '14px 28px',
  backgroundColor: '#bbb',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  fontWeight: 'bold'
};

const checkoutButtonStyle = {
  padding: '14px 28px',
  backgroundColor: '#c8102e',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  fontWeight: 'bold'
};

export default OrderFormPage;
