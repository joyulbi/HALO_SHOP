import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user_YG';

// 만약 JWT 커스텀 훅(예: useAuth) 있다면 import (없으면 해당 부분만 빼고 사용)
import { useAuth } from '../hooks/useAuth'; // 실제 경로/이름에 맞게!
import { useCart } from '../context/CartContext';

const Header = () => {
  const dispatch = useDispatch();
  const { setCartCount } = useCart();

  // JWT 로그인 상태 가져오기 (없으면 해당 부분은 생략 또는 주석)
  // useAuth 훅에서 { isLoggedIn, user, logout } 이런 식으로 반환된다고 가정
  let jwtLoggedIn = false;
  let jwtUser = null;
  let jwtLogout = null;

  try {
    // useAuth 훅이 정의되어 있을 때만 동작 (오류 방지)
    // 없으면 아래 부분 무시해도 됨
    const auth = useAuth?.();
    if (auth) {
      jwtLoggedIn = auth.isLoggedIn;
      jwtUser = auth.user;
      jwtLogout = auth.logout;
    }
  } catch (e) {
    // useAuth 훅 없으면 무시
  }

  // 리덕스 세션 로그인 상태
  const { isLogin: sessionLoggedIn, user: sessionUser } = useSelector(state => state.user_YG);

  // 최종 로그인 여부/사용자 정보: 둘 중 하나라도 로그인 시
  const isLoggedIn = jwtLoggedIn || sessionLoggedIn;
  const user = jwtUser || sessionUser;

  const navLinkStyle = {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold',
    transition: 'color 0.3s',
    letterSpacing: '1px',
    padding: '8px 12px',
  };

  // 로그아웃 처리 (jwt, 세션 방식 모두)
  const handleLogout = () => {
    if (jwtLoggedIn && jwtLogout) {
      jwtLogout();
    } else if (sessionLoggedIn) {
      dispatch({ type: LOG_OUT_REQUEST });
    }
    setCartCount(0);
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
      <Link href="/" legacyBehavior>
        <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/images/logo.png" alt="HALOSHOP Logo" width={60} height={60} />
          <span style={{
            fontSize: '24px', fontWeight: 'bold', marginLeft: '10px',
            color: 'black', transition: 'color 0.3s', letterSpacing: '1.5px'
          }}>
            HALO SHOP
          </span>
        </a>
      </Link>

      {/* 네비 */}
      <nav style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '100px', fontSize: '18px'
      }}>
        <Link href="/" legacyBehavior><a style={navLinkStyle}>홈</a></Link>
        <Link href="/items" legacyBehavior><a style={navLinkStyle}>상품</a></Link>
        <Link href="/campaign" legacyBehavior><a style={navLinkStyle}>기부캠페인</a></Link>
        <Link href="/auction" legacyBehavior><a style={navLinkStyle}>경매</a></Link>
        <Link href="/contact" legacyBehavior><a style={navLinkStyle}>고객센터</a></Link>
      </nav>

      {/* 로그인/회원가입/마이페이지/로그아웃 */}
      <div style={{
        position: 'absolute', right: '40px',
        display: 'flex', gap: '20px', fontSize: '16px', alignItems: 'center',
      }}>
        {isLoggedIn ? (
          <>
            <span style={{ ...navLinkStyle, color: '#555', cursor: 'default' }}>
              {user?.nickname ? `${user.nickname}님` : '마이페이지'}
            </span>
            <Link href="/mypage" legacyBehavior>
              <a style={navLinkStyle}>마이페이지</a>
            </Link>
            <button
              onClick={handleLogout}
              style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login" legacyBehavior>
              <a style={navLinkStyle}>로그인</a>
            </Link>
            <Link href="/signup" legacyBehavior>
              <a style={navLinkStyle}>회원가입</a>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
