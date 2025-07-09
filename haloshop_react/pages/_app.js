// pages/_app.js
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { wrapper } from '../store/configureStore';
import { AuthProvider } from '../hooks/useAuth';
import { CartProvider } from '../context/CartContext';
import { CartButtonContext } from '../context/CartButtonContext';
import Layout from '../components/Layout';
import WebSocketClient from '../components/WebSocketClient';
import api from '../utils/axios';

import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
  const cartButtonRef = useRef(null);
  const router = useRouter();

  // 🔥 마이페이지는 레이아웃 제외
  const isMyPage = router.pathname.startsWith('/mypage');

  // 0.5초마다 세션 체크 폴링
  useEffect(() => {
    const iv = setInterval(async () => {
      try {
        await api.get('/user/me');
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = '/member/login?timeout=true';
        }
      }
    }, 500);
    return () => clearInterval(iv);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WebSocketClient />
        <CartButtonContext.Provider value={{ cartButtonRef }}>
          {isMyPage ? (
            <Component {...pageProps} />
          ) : (
            <Layout cartRef={cartButtonRef}>
              <Component {...pageProps} />
            </Layout>
          )}
        </CartButtonContext.Provider>
      </CartProvider>
    </AuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
