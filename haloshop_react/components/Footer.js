import React from 'react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: '#f1f1f1',
      padding: '30px 20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#555',
      borderTop: '1px solid #ddd',
      marginTop: '50px'
    }}>
      {/* 회사 정보 */}
      <div style={{ marginBottom: '10px' }}>
        HALOSHOP | 대표: 박김조안김김 | 사업자등록번호: 899600-010203
      </div>
      <div style={{ marginBottom: '10px' }}>
        주소: 인천 부평구 대충 학원주소 | 고객센터: 112 | 이메일: email@haloshop.com
      </div>

      {/* 링크 */}
      <div style={{ marginBottom: '10px' }}>
        <a href="#" style={{ margin: '0 10px', textDecoration: 'none', color: 'black' }}>이용약관</a> |
        <a href="#" style={{ margin: '0 10px', textDecoration: 'none', color: 'black' }}>개인정보처리방침</a> |
        <a href="#" style={{ margin: '0 10px', textDecoration: 'none', color: 'black' }}>고객센터</a>
      </div>

      {/* 저작권 */}
      <div style={{ marginBottom: '10px' }}>
        © 2025 HALOSHOP. All rights reserved.
      </div>

      {/* 맨 위로 버튼 */}
      <button onClick={scrollToTop} style={{
        marginTop: '10px',
        padding: '8px 16px',
        border: 'none',
        backgroundColor: '#c8102e',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        맨 위로 ↑
      </button>
    </footer>
  );
};

export default Footer;
