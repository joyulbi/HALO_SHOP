import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => { // ✅ 수정
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const res = await api.get('/api/cart');
        setCartCount(res.data.length);
      } catch (err) {
        console.error('장바구니 개수 불러오기 실패:', err);
      }
    } else {
      setCartCount(0);
    }
  };

  const refreshCart = async () => { // ✅ 수정
    await fetchCartCount();
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount, refreshCart }}> {/* ✅ 수정 */}
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
