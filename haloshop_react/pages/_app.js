import { wrapper } from '../store/configureStore';
import { AuthProvider } from '../hooks/useAuth';
import { CartProvider } from '../context/CartContext';
import { CartButtonContext } from '../context/CartButtonContext';
import Layout from '../components/Layout';
import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'antd/dist/antd.css';
import WebSocketClient from '../components/WebSocketClient';

import { useRef } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const cartButtonRef = useRef(null);
  const router = useRouter();

  // 🔥 마이페이지는 레이아웃 제외
  const isMyPage = router.pathname.startsWith('/mypage');

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
