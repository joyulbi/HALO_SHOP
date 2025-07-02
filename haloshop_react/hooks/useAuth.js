import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { useRouter } from 'next/router';

const API_BASE_URL = 'http://localhost:8080';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 로그인 상태 유지: JWT 토큰 우선 체크, 없으면 세션 로그인 체크
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    const normalizeUser = (rawUser) => {
      if (!rawUser) return null;
      return {
        id: rawUser.id || null,
        email: rawUser.email || '',
        nickname: rawUser.nickname || rawUser.email || '사용자',
        isAdmin: !!rawUser.isAdmin,
        // 필요한 필드 추가 가능
      };
    };

    if (accessToken) {
      setIsLoggedIn(true);
      (async () => {
        try {
          const userInfoRes = await api.get(`${API_BASE_URL}/user/me`);
          if (userInfoRes.status === 200 && userInfoRes.data) {
            const rawUser = userInfoRes.data.account || userInfoRes.data.user || null;
            setUser(normalizeUser(rawUser));
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        } catch (e) {
          setUser(null);
          setIsLoggedIn(false);
        }
      })();
    } else {
      // JWT 토큰 없으면 세션 로그인(관리자)인지 서버에 한번 확인
      (async () => {
        try {
          const res = await api.get(`${API_BASE_URL}/user/me`);
          if (res.status === 200 && res.data) {
            const rawUser = res.data.account || res.data.user || null;
            if (rawUser && rawUser.isAdmin) {
              setIsLoggedIn(true);
              setUser(normalizeUser(rawUser));
            } else {
              setIsLoggedIn(false);
              setUser(null);
            }
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (e) {
          setIsLoggedIn(false);
          setUser(null);
        }
      })();
    }
  }, []);

  // 로그인 함수 (JWT 유저 / 관리자 세션 로그인 구분)
  const login = async (email, password) => {
    try {
      const res = await api.post(`${API_BASE_URL}/auth/login`, { email, password });
      const data = res.data;

      // 1. 관리자(세션) 로그인 성공 메시지 기준
      if (typeof data === 'string' && data.includes("관리자 로그인 성공")) {
        setIsLoggedIn(true);
        setUser({
          id: null,
          email,
          nickname: '관리자',
          isAdmin: true,
        });
        router.push('/');
        return { success: true };
      }
      // 2. 일반유저(JWT)
      else if (data && data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setIsLoggedIn(true);

        // JWT 유저 정보 조회 및 통일된 형태로 저장
        try {
          const userInfoRes = await api.get(`${API_BASE_URL}/user/me`);
          if (userInfoRes.status === 200 && userInfoRes.data) {
            const rawUser = userInfoRes.data.account || userInfoRes.data.user || null;
            setUser(normalizeUser(rawUser));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }

        router.push('/');
        return { success: true };
      } else {
        return { success: false, message: "로그인 응답 형식이 올바르지 않습니다." };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response ? err.response.data : "네트워크 오류 또는 서버 응답 없음."
      };
    }
  };

  // 로그아웃 처리: JWT 토큰 있으면 JWT 로그아웃, 없으면 세션 로그아웃
  const logoutUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        await api.post(`${API_BASE_URL}/auth/logout`, { accessToken, refreshToken });
      } else {
        await api.post(`${API_BASE_URL}/auth/logout`, {}); // 세션 로그아웃
      }
    } catch (error) {
      // 무시
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    }
  };

  const authContextValue = {
    isLoggedIn,
    user,
    login,
    logout: logoutUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
