import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const { setCartCount } = useCart();

  useEffect(() => {
    api.get('/api/cart')
      .then(res => setCartItems(res.data))
      .catch(err => console.error('장바구니 불러오기 실패:', err));
  }, []);

  const increaseQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    api.put(`/api/cart/${item.id}`, updatedItem)
      .then(() => {
        setCartItems(cartItems.map(ci => ci.id === item.id ? updatedItem : ci));
      })
      .catch(err => console.error('수량 증가 실패:', err));
  };

  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) return;
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    api.put(`/api/cart/${item.id}`, updatedItem)
      .then(() => {
        setCartItems(cartItems.map(ci => ci.id === item.id ? updatedItem : ci));
      })
      .catch(err => console.error('수량 감소 실패:', err));
  };

  const deleteItem = (id) => {
    api.delete(`/api/cart/${id}`)
      .then(() => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setCartCount(prev => prev - 1);
      })
      .catch(err => console.error('삭제 실패:', err));
  };

const handleCheckout = () => {
    router.push('/order/CartOrderFormPage');
};

  const handleCancel = () => {
    router.push('/');
  };

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
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.1s ease-in-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                  src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : '/images/no-image.png'}
                  alt={item.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <div>
                  <h3 style={{ marginBottom: '10px' }}>{item.name}</h3>
                  <p style={{ color: '#4a9fff', fontWeight: 'bold' }}>{item.price.toLocaleString()}원</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => decreaseQuantity(item)} style={iconButtonStyle}>➖</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item)} style={iconButtonStyle}>➕</button>
              </div>

              <button onClick={() => deleteItem(item.id)} style={deleteButtonStyle}>🗑️</button>
            </div>
          ))}

          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            marginTop: '40px',
            backgroundColor: '#f6f6f6',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Summary</h3>
            <p>총 가격: {totalPrice.toLocaleString()}원</p>
            <p style={{ fontWeight: 'bold', color: '#c8102e', fontSize: '1.1rem' }}>
              최종 결제 금액: {totalPrice}원
            </p>

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

// ✔️ 아이콘 버튼 스타일
const iconButtonStyle = {
  padding: '4px 8px',
  backgroundColor: '#4a9fff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.2s',
};

// ✔️ 삭제 버튼 스타일
const deleteButtonStyle = {
  backgroundColor: '#ff5555',
  color: 'white',
  padding: '6px 12px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.2s',
};

// ✔️ 취소 버튼
const cancelButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#999',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.2s',
};

// ✔️ 결제 버튼
const checkoutButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#4a9fff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.2s',
};

export default CartPage;
