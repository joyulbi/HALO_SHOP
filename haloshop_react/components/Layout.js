import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 항상 최상단 */}
      <Header />

      {/* 본문 (가변) */}
      <main style={{ flex: 1, maxWidth: '1600px', margin: '0 auto', padding: '0 40px' }}>
        {children}
      </main>

      {/* 푸터 항상 하단 */}
      <Footer />
    </div>
  );
};

export default Layout;