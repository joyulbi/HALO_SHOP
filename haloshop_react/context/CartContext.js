// context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios'; // 너가 쓰던 axios 그대로

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/cart')
        .then(res => {
          // 개수 합산 (모든 아이템의 quantity 총합)
          const totalQuantity = res.data.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalQuantity);
        })
        .catch(err => console.error('장바구니 개수 불러오기 실패:', err));
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
