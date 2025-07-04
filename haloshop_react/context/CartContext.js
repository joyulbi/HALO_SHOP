import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // ✅ 상품 종류 개수 기준으로 카운트 계산
  const fetchCartCount = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/cart')
        .then(res => {
          setCartCount(res.data.length); // 👉 상품 종류 개수로 변경
        })
        .catch(err => console.error('장바구니 개수 불러오기 실패:', err));
    } else {
      setCartCount(0); // 토큰 없으면 0으로 초기화
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
