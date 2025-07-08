import React, { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';

const SingleOrderFormPage = () => {
  const [item, setItem] = useState(null);
  const [point, setPoint] = useState('');
  const [appliedPoint, setAppliedPoint] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [userPoint, setUserPoint] = useState(0); // ✅ 보유 포인트 상태 추가
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { itemId, itemName, price, quantity } = router.query;

  // 로그인 확인
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  }, [authLoading, isLoggedIn, router]);

  // 유저 보유 포인트 로드
  useEffect(() => {
    if (user?.id) {
      api.get(`/api/userpoint/${user.id}`)
        .then(res => {
          console.log('유저 포인트:', res.data.totalPoint);
          setUserPoint(res.data.totalPoint);
        })
        .catch(err => console.error('유저 포인트 불러오기 실패:', err));
    }
  }, [user]);

  // URL 쿼리 기반으로 단일 아이템 세팅
  useEffect(() => {
    if (itemId && itemName && price && quantity) {
      setItem({
        itemId: parseInt(itemId, 10),
        name: itemName,
        price: parseInt(price, 10),
        quantity: parseInt(quantity, 10)
      });
    }
  }, [itemId, itemName, price, quantity]);

  // 결제하기 버튼
  const handlePayNow = async () => {
    if (!user?.id) {
      alert('로그인 후 이용해 주세요.');
      router.push('/login');
      return;
    }

    try {
      const totalPrice = item.price * item.quantity;
      const payAmount = totalPrice - appliedPoint;

      const payload = {
        totalPrice,
        payAmount,
        amount: appliedPoint,
        used: paymentMethod,
        paymentStatus: "PENDING",
        accountId: user.id,
        orderItems: [{
          itemId: item.itemId,
          itemName: item.name,
          productPrice: item.price,
          quantity: item.quantity
        }]
      };

      if (paymentMethod === 'KAKAOPAY') {
        const res = await api.post('/api/payment/ready', payload);
        console.log('카카오페이 응답:', res.data);
        if (res.data.next_redirect_pc_url) {
          window.location.href = res.data.next_redirect_pc_url;
        } else {
          alert('카카오페이 결제 URL을 받아오지 못했습니다.');
        }
      } else {
        console.log('결제 payload:', payload);
        const res = await api.post('/api/orders', payload);
        console.log('주문 완료 응답:', res.data);
        alert('주문이 완료되었습니다!');
        router.push(`/mypage/orders/${res.data.orderId}`);
      }
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  // 포인트 적용 버튼
  const handleApplyPoint = () => {
    const pointValue = parseInt(point, 10) || 0;
    const totalPrice = item.price * item.quantity;

    if (pointValue < 0) {
      alert('0 이상의 값을 입력하세요.');
      return;
    }
    if (pointValue > userPoint) {
      alert(`보유한 포인트(${userPoint.toLocaleString()}P)까지만 사용 가능합니다.`);
      setAppliedPoint(userPoint);
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

  if (!item) {
    return <p style={{ textAlign: 'center', marginTop: '100px' }}>상품 정보를 불러오는 중입니다...</p>;
  }

  const totalPrice = item.price * item.quantity;
  const finalPrice = totalPrice - appliedPoint;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
        단일 상품 결제
      </h1>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h3>{item.name}</h3>
          <p style={{ color: '#c8102e', fontWeight: 'bold' }}>{item.price.toLocaleString()}원</p>
          <p>수량: {item.quantity}</p>
        </div>
      </div>

      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h3>결제 요약</h3>
        <p>상품 금액: {totalPrice.toLocaleString()}원</p>
        <p>포인트 사용: {appliedPoint.toLocaleString()}원</p>
        <p style={{ fontWeight: 'bold', color: '#c8102e' }}>
          총 결제 금액: {finalPrice.toLocaleString()}원
        </p>

        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder={`(보유: ${userPoint.toLocaleString()}P)`}
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            style={{ padding: '10px', width: '200px', marginRight: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button onClick={handleApplyPoint} style={applyButtonStyle}>포인트 적용</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ marginRight: '10px' }}>결제 수단 선택:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="CARD">카드 결제</option>
            <option value="KAKAOPAY">카카오페이</option>
          </select>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => router.back()} style={cancelButtonStyle}>취소</button>
          <button onClick={handlePayNow} style={checkoutButtonStyle}>결제하기</button>
        </div>
      </div>
    </div>
  );
};

const applyButtonStyle = {
  padding: '10px 16px',
  backgroundColor: '#c8102e',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const cancelButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#999',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const checkoutButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#c8102e',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default SingleOrderFormPage;
