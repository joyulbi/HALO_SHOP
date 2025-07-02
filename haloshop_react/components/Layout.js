// components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import QuickMenu from './QuickMenu'; // ✅ 퀵 메뉴 추가

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '1600px', margin: '0 auto', padding: '0 40px' }}>
        {children}
      </main>
      <Footer />
      <QuickMenu /> {/* ✅ 퀵 메뉴를 여기 고정 */}
    </div>
  );
};

export default Layout;
