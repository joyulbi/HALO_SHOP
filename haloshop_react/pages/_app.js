import { wrapper } from '../store/configureStore';
import { AuthProvider } from '../hooks/useAuth';
import { CartProvider } from '../context/CartContext';
import { CartButtonContext } from '../context/CartButtonContext'; // 🔥 추가
import Layout from '../components/Layout';
import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'antd/dist/antd.css';

import { useRef } from 'react'; // 🔥 추가

function MyApp({ Component, pageProps }) {
  const cartButtonRef = useRef(null); // 🔥 전역 ref 생성

  return (
    <AuthProvider>
      <CartProvider>
        <CartButtonContext.Provider value={{ cartButtonRef }}> {/* 🔥 Provider 추가 */}
          <Layout cartRef={cartButtonRef}> {/* 🔥 Layout에 ref 전달 */}
            <Component {...pageProps} />
          </Layout>
        </CartButtonContext.Provider>
      </CartProvider>
    </AuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
