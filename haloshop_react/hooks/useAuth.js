// src/hooks/useAuth.js
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
   * 공통 프로필 페칭
   * 1) 세션 기반 관리자
   * 2) JWT 기반 일반 유저
   */
  const fetchProfile = async () => {
    // 1) 세션 기반 관리자 시도
    try {
      const resAdmin = await api.get('/admin/me');
      if (resAdmin.status === 200 && resAdmin.data?.account) {
        setUser({ ...resAdmin.data.account, admin: true });
        setIsLoggedIn(true);
        setLoading(false);
        return 'admin';
      }
    } catch {
      // 관리자 세션 없으면 JWT 유저로 분기
    }

    // 2) JWT 토큰 검사
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
      return null;
    }

    try {
      // axios 인터셉터가 Authorization 헤더 처리
      const resUser = await api.get('/user/me');
      if (resUser.status === 200 && resUser.data?.account) {
        setUser({ ...resUser.data.account, user: resUser.data.user });
        setIsLoggedIn(true);
        setLoading(false);
        return 'user';
      }
    } catch {
      // JWT 유저 인증 실패
    }

    // 3) 미인증
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
    return null;
  };

  // 마운트 시 프로필 체크
  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * 로그인 요청
   */
  const login = async (email, password) => {
    try {
      // api.post uses withCredentials=true
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;

      // 1) 관리자 세션 로그인
      if (typeof data === 'string' && data.includes('관리자 로그인 성공')) {
        await fetchProfile();
        router.push('/');
        return { success: true };
      }

      // 2) JWT 일반 유저
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        await fetchProfile();
        router.push('/');
        return { success: true };
      }

      return { success: false, message: '로그인 응답이 올바르지 않습니다.' };
    } catch (err) {
      // err.response?.data 가 객체일 수 있으니, message 필드 우선, 없으면 JSON 문자열화
      let msg = '네트워크 오류';
      const data = err.response?.data;
      if (data) {
        if (typeof data === 'string') {
          msg = data;
        } else if (data.message) {
          msg = data.message;
        } else {
          msg = JSON.stringify(data);
        }
      }
      return { success: false, message: msg };
    }
  };

  /**
   * 로그아웃 요청
   */
  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        // JWT 로그아웃
        await api.post('/auth/logout', { accessToken, refreshToken });
      } else {
        // 세션 로그아웃
        await api.post('/auth/logout', {});
      }
    } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
    window.location.replace('/login');
  };

  const authContextValue = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
