import React, { useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import QuickMenu from './QuickMenu'; 
import RecommendedSidebar from './RecommendedSidebar';  // 🔥 추천 상품 컴포넌트 import

const Layout = ({ children, cartRef }) => { // 🔥 cartRef prop 받기
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '1600px', margin: '0 auto', padding: '0 40px' }}>
        {children}
      </main>
      <Footer />
      <QuickMenu cartRef={cartRef} /> {/* 🔥 cartRef 전달 */}
      
      {/* 퀵메뉴 아래에 추천 상품 사이드바 배치 */}
      <RecommendedSidebar /> 
    </div>
  );
};

export default Layout;
