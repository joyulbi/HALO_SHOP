import { wrapper } from '../store/configureStore';
import { AuthProvider } from '../hooks/useAuth';
import { CartProvider } from '../context/CartContext';
import Layout from '../components/Layout';
import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider> {/* 🔥 CartProvider 추가 */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
