import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth'; // JWT 로그인 훅
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user_YG';

const Header = () => {
  const dispatch = useDispatch();

  // JWT 로그인 관련 상태
  const { isLoggedIn: jwtLoggedIn, user: jwtUser, logout: jwtLogout } = useAuth();

  // 세션 로그인 관련 상태 (redux)
  const { isLogin: sessionLoggedIn, user: sessionUser } = useSelector(state => state.user_YG);

  // 로그인 상태 판단 (둘 중 하나라도 로그인 중이면 로그인 상태)
  const isLoggedIn = jwtLoggedIn || sessionLoggedIn;

  // 사용자 정보 - JWT 우선, 없으면 세션 사용자 정보 사용
  const user = jwtUser || sessionUser;

  // 로그아웃 처리
  const handleLogout = () => {
    if (jwtLoggedIn) {
      // JWT 로그인 로그아웃
      jwtLogout();
    } else if (sessionLoggedIn) {
      // 세션 로그인 로그아웃
      dispatch({ type: LOG_OUT_REQUEST });
    }
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold',
    transition: 'color 0.3s',
    letterSpacing: '1px',
    padding: '8px 12px',
  };

  return (
    <header
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '80px',
        padding: '0 40px',
        boxSizing: 'border-box',
      }}
    >
      {/* 로고 */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}>
        <Image src="/images/logo.png" alt="HALOSHOP Logo" width={60} height={60} />
        <span
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginLeft: '10px',
            color: 'black',
            transition: 'color 0.3s',
            letterSpacing: '1.5px',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
          onMouseLeave={(e) => (e.target.style.color = 'black')}
        >
          HALO SHOP
        </span>
      </Link>

      {/* 네비게이션 */}
      <nav
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '100px',
          fontSize: '18px',
        }}
      >
        <Link
          href="/"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
          onMouseLeave={(e) => (e.target.style.color = 'black')}
        >
          홈
        </Link>
        <Link
          href="/items"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
          onMouseLeave={(e) => (e.target.style.color = 'black')}
        >
          상품
        </Link>
        <Link
          href="/campaign"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
          onMouseLeave={(e) => (e.target.style.color = 'black')}
        >
          기부캠페인
        </Link>
        <Link
          href="/auction"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
          onMouseLeave={(e) => (e.target.style.color = 'black')}
        >
          경매
        </Link>
        <Link
          href="/customer"
          style={navLinkStyle}
          onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
          onMouseLeave={(e) => (e.target.style.color = 'black')}
        >
          고객센터
        </Link>
      </nav>

      {/* 로그인 / 로그아웃 영역 */}
      <div
        style={{
          position: 'absolute',
          right: '40px',
          display: 'flex',
          gap: '20px',
          fontSize: '16px',
          alignItems: 'center',
        }}
      >
        {isLoggedIn ? (
          <>
            {user && user.nickname && (
              <span
                style={{ ...navLinkStyle, cursor: 'default', color: '#555' }}
                onMouseEnter={(e) => (e.target.style.color = '#555')}
                onMouseLeave={(e) => (e.target.style.color = '#555')}
              >
                {user.nickname}님
              </span>
            )}
            <Link
              href="/mypage"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
              onMouseLeave={(e) => (e.target.style.color = 'black')}
            >
              마이페이지
            </Link>
            <button
              onClick={handleLogout}
              style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
              onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
              onMouseLeave={(e) => (e.target.style.color = 'black')}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
              onMouseLeave={(e) => (e.target.style.color = 'black')}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.target.style.color = '#c8102e')}
              onMouseLeave={(e) => (e.target.style.color = 'black')}
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
