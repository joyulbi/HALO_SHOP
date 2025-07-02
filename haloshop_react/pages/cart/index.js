import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext'; // 🔥 추가

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const { setCartCount } = useCart(); // 🔥 추가

  // 장바구니 불러오기
  useEffect(() => {
    api.get('/api/cart')
      .then(res => setCartItems(res.data))
      .catch(err => console.error('장바구니 불러오기 실패:', err));
  }, []);

  // 수량 증가
  const increaseQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    api.put(`/api/cart/${item.id}`, updatedItem)
      .then(() => {
        setCartItems(cartItems.map(ci => ci.id === item.id ? updatedItem : ci));
        setCartCount(prev => prev + 1); // 🔥 장바구니 개수 +1
      })
      .catch(err => console.error('수량 증가 실패:', err));
  };

  // 수량 감소
  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) return;
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    api.put(`/api/cart/${item.id}`, updatedItem)
      .then(() => {
        setCartItems(cartItems.map(ci => ci.id === item.id ? updatedItem : ci));
        setCartCount(prev => prev - 1); // 🔥 장바구니 개수 -1
      })
      .catch(err => console.error('수량 감소 실패:', err));
  };

  // 장바구니 삭제
  const deleteItem = (id) => {
    const targetItem = cartItems.find(item => item.id === id); // 🔥 삭제 전 수량
    api.delete(`/api/cart/${id}`)
      .then(() => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setCartCount(prev => prev - targetItem.quantity); // 🔥 삭제한 수량만큼 차감
      })
      .catch(err => console.error('삭제 실패:', err));
  };

  // 결제하기 버튼 클릭
  const handleCheckout = () => {
    alert('결제 페이지로 이동 (구현 예정)');
    // router.push('/order'); // 결제 페이지로 이동
  };

  // 취소하기 버튼 클릭
  const handleCancel = () => {
    router.push('/');
  };

  // 총 가격 계산
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 3500;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
        Cart ({cartItems.length})
      </h1>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>장바구니가 비어 있습니다.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              borderBottom: '1px solid #ddd',
              borderRadius: '10px',
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                  src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : '/images/no-image.png'}
                  alt={item.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <div>
                  <h3 style={{ marginBottom: '10px' }}>{item.name}</h3>
                  <p style={{ color: '#c8102e', fontWeight: 'bold' }}>{item.price.toLocaleString()}원</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => decreaseQuantity(item)} style={buttonStyle}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item)} style={buttonStyle}>+</button>
              </div>

              <button onClick={() => deleteItem(item.id)} style={{
                backgroundColor: '#999',
                color: '#fff',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>삭제</button>
            </div>
          ))}

          {/* Summary */}
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', marginTop: '40px' }}>
            <h3>Summary</h3>
            <p>총 가격: {totalPrice.toLocaleString()}원</p>
            <p>배송비: {deliveryFee.toLocaleString()}원</p>
            <p style={{ fontWeight: 'bold', color: '#c8102e' }}>최종 결제 금액: {(totalPrice + deliveryFee).toLocaleString()}원</p>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={handleCancel} style={cancelButtonStyle}>취소하기</button>
              <button onClick={handleCheckout} style={checkoutButtonStyle}>결제하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 버튼 스타일 유지
const buttonStyle = {
  padding: '8px 12px',
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

export default CartPage;
