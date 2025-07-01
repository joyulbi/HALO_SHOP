import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const navLinkStyle = {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold',
    transition: 'color 0.3s',
    letterSpacing: '1px',   // 🔥 글자 간 더 띄우기
    padding: '8px 12px'     // 🔥 클릭 영역 더 넓게
  };

  return (
    <header style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '80px',
      padding: '0 40px',
      boxSizing: 'border-box'
    }}>
      {/* 로고 */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}>
        <Image src="/images/logo.png" alt="HALOSHOP Logo" width={60} height={60} />
        <span
          style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '10px', color: 'black', transition: 'color 0.3s', letterSpacing: '1.5px' }}
          onMouseEnter={(e) => e.target.style.color = '#c8102e'}
          onMouseLeave={(e) => e.target.style.color = 'black'}
        >
          HALO SHOP
        </span>
      </Link>

      {/* 네비 */}
      <nav style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '100px',            // 🔥 메뉴 간 간격 넉넉하게
        fontSize: '18px'
      }}>
        <Link href="/" style={navLinkStyle} onMouseEnter={(e) => e.target.style.color = '#c8102e'} onMouseLeave={(e) => e.target.style.color = 'black'}>홈</Link>
        <Link href="/items" style={navLinkStyle} onMouseEnter={(e) => e.target.style.color = '#c8102e'} onMouseLeave={(e) => e.target.style.color = 'black'}>상품</Link>
        <Link href="/campaign" style={navLinkStyle} onMouseEnter={(e) => e.target.style.color = '#c8102e'} onMouseLeave={(e) => e.target.style.color = 'black'}>기부캠페인</Link>
        <Link href="/donation" style={navLinkStyle} onMouseEnter={(e) => e.target.style.color = '#c8102e'} onMouseLeave={(e) => e.target.style.color = 'black'}>기부캠페인</Link>
        <Link href="/auction" style={navLinkStyle} onMouseEnter={(e) => e.target.style.color = '#c8102e'} onMouseLeave={(e) => e.target.style.color = 'black'}>경매</Link>
        <Link href="/customer" style={navLinkStyle} onMouseEnter={(e) => e.target.style.color = '#c8102e'} onMouseLeave={(e) => e.target.style.color = 'black'}>고객센터</Link>
      </nav>
    </header>
  );
};

export default Header;
