// pages/_app.js
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { wrapper } from '../store/configureStore';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { CartProvider } from '../context/CartContext';
import { CartButtonContext } from '../context/CartButtonContext';
import Layout from '../components/Layout';
import WebSocketClient from '../components/WebSocketClient';
import api from '../utils/axios';

import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'antd/dist/antd.css';

function AppContent({ Component, pageProps }) {
  const cartButtonRef = useRef(null);
  const router = useRouter();
  const { isLoggedIn } = useAuth();       // 로그인 상태
  const isMyPage = router.pathname.startsWith('/mypage');

  // 로그인 돼 있을 때만 1초마다 세션 체크 폴링
  useEffect(() => {
    if (!isLoggedIn) return;               // false 면 폴링 시작 안 함
    const iv = setInterval(async () => {
      try {
        await api.get('/user/me');
      } catch (err) {
        if (err.response?.status === 401) {
          clearInterval(iv);
          window.location.href = '/member/login?timeout=true';
        }
      }
    }, 1000);

    // 언마운트 혹은 isLoggedIn 변경 시 interval 정리
    return () => clearInterval(iv);
  }, [isLoggedIn]);

  return (
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
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
