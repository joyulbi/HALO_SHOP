// pages/_app.js
import { wrapper } from '../store/configureStore';
import { AuthProvider } from '../hooks/useAuth';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
export default wrapper.withRedux(MyApp);
