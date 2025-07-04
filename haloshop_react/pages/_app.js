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

function MyApp({ Component, pageProps }) {
  const cartButtonRef = useRef(null); 

  return (
    <AuthProvider>
      <CartProvider>
        <CartButtonContext.Provider value={{ cartButtonRef }}>
          <Layout cartRef={cartButtonRef}> 
            <WebSocketClient />
            <Component {...pageProps} />
          </Layout>
        </CartButtonContext.Provider>
      </CartProvider>
    </AuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
