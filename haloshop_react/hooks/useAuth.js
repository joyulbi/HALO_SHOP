import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * 공통 프로필 패칭 함수
   * 1. /admin/me → 성공시 관리자 정보 반환
   * 2. /user/me → 실패시 일반 유저 정보 반환
   */
  const fetchProfile = async () => {
  try {
    // (1) 세션 기반 관리자 먼저 시도
    const resAdmin = await api.get('/admin/me');
    if (resAdmin.status === 200 && resAdmin.data && resAdmin.data.admin) {
      setUser({
        ...resAdmin.data.account,
        admin: resAdmin.data.admin,
      });
      setIsLoggedIn(true);
      setLoading(false);
      return 'admin';
    }
  } catch (e) {
    // 세션 인증 실패 -> JWT 로그인 시도
  }

  // (2) JWT 기반 일반 유저
  const token = localStorage.getItem('accessToken');
  if (!token) {
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
    return null;
  }

  try {
    const resUser = await api.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resUser.status === 200 && resUser.data) {
      setUser({
        ...(resUser.data.account || {}),
        user: resUser.data.user || {},
      });
      setIsLoggedIn(true);
      setLoading(false);
      return 'user';
    }
  } catch {}

  // (3) 둘 다 실패
  setUser(null);
  setIsLoggedIn(false);
  setLoading(false);
  return null;
};


  // 마운트/새로고침 시 프로필 자동 체크
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // ===== 로그인 =====
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;
      // (1) 세션 관리자
      if (typeof data === 'string' && data.includes('관리자 로그인 성공')) {
        await fetchProfile();
        router.push('/');
        return { success: true };
      }
      // (2) JWT 유저
      else if (data && data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        await fetchProfile();
        router.push('/');
        return { success: true };
      } else {
        return { success: false, message: '로그인 응답이 올바르지 않습니다.' };
      }
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data || "네트워크 오류 또는 서버 응답 없음."
      };
    }
  };

  // ===== 로그아웃 =====
  const logoutUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        await api.post('/auth/logout', { accessToken, refreshToken });
      } else {
        await api.post('/auth/logout', {}); // 세션 로그아웃
      }
    } catch {}
    // 💡 토큰 먼저 삭제 (중복삭제 안전)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
    // 완전 초기화: 뒤로가기도 막힘
    window.location.replace('/login');
  };

  const authContextValue = {
    isLoggedIn,
    user,
    loading,
    login,
    logout: logoutUser,
    refreshProfile: fetchProfile,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
