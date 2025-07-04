import React, { useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import QuickMenu from './QuickMenu'; 

const Layout = ({ children, cartRef }) => { // 🔥 cartRef prop 받기
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '1600px', margin: '0 auto', padding: '0 40px' }}>
        {children}
      </main>
      <Footer />
      <QuickMenu cartRef={cartRef} /> {/* 🔥 cartRef 전달 */}
    </div>
  );
};

export default Layout;
