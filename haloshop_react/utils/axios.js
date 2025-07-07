// src/utils/axios.js
// =========================
// Axios 인스턴스 설정 파일
// - 백엔드 세션 쿠키, CSRF 토큰, JWT 토큰 등을 관리
// =========================

import axios from 'axios';

// -------------------------
// 1) 기본 URL 설정
//    - 개발 환경: http://localhost:8080
//    - 배포 환경: 실제 도메인으로 변경 필요
// -------------------------
const API_BASE_URL = 'http://localhost:8080'; 

// -------------------------
// 2) Axios 인스턴스 생성
//    - withCredentials: true 로 설정하여
//      교차 출처 요청에서도 쿠키를 전송/수신
//    - Content-Type: JSON
// -------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // 쿠키 전송 허용 (세션, CSRF용)
});

// -------------------------
// 3) 요청 인터셉터 (Request Interceptor)
//    - JWT accessToken이 있으면 Authorization 헤더에 자동 추가
//    - CSRF 토큰(XSRF-TOKEN) 쿠키가 있으면
//      Spring Security 기본 헤더명 'X-XSRF-TOKEN' 으로 추가
// -------------------------
api.interceptors.request.use(
  (config) => {
    // 3-1) JWT Access Token 처리
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 3-2) CSRF 토큰 처리
    //    Spring 기본 CSRF 쿠키 이름: 'XSRF-TOKEN'
    //    Spring 기본 헤더 이름: 'X-XSRF-TOKEN'
    const csrfToken = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------
// 4) 응답 인터셉터 (Response Interceptor)
//    - 401 Unauthorized 등 에러 처리
//    - (토큰 갱신 로직은 useAuth.js에 구현)
// -------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 글로벌 에러 로깅 가능
    console.error('[API ERROR]', error.response?.status, error);
    return Promise.reject(error);
  }
);

// -------------------------
// 5) 모듈 내보내기
//    - 다른 컴포넌트 / 훅에서 import하여 사용
// -------------------------
export default api;
