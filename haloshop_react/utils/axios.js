// src/utils/axios.js
import axios from 'axios';

// 백엔드 API의 기본 URL을 설정합니다.
// 이 값은 application.properties/yml에 설정된 Spring Boot 서버의 포트와 일치해야 합니다.
// 개발 환경에서는 'http://localhost:8080'을 사용하고, 배포 시에는 변경해야 합니다.
const API_BASE_URL = 'http://localhost:8080'; 

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // 기본적으로 JSON 형식으로 통신
  },
  // 백엔드가 세션 쿠키(예: CSRF 토큰)를 설정하는 경우,
  // 교차 출처 요청 시에도 쿠키를 함께 보내도록 허용합니다.
  withCredentials: true, 
});

// --- 요청 인터셉터 (Request Interceptor) ---
// 모든 나가는 HTTP 요청 전에 실행됩니다.
// 이 곳에서 JWT Access Token을 요청 헤더에 자동으로 추가합니다.
api.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken을 가져옵니다.
    const accessToken = localStorage.getItem('accessToken');
    // accessToken이 존재하면, Authorization 헤더에 'Bearer <token>' 형식으로 추가합니다.
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // 수정된 요청 설정을 반환하여 다음 단계로 진행합니다.
    return config;
  },
  (error) => {
    // 요청 오류 발생 시, Promise를 거부하여 에러를 전파합니다.
    return Promise.reject(error);
  }
);

// --- 응답 인터셉터 (Response Interceptor) ---
// 모든 HTTP 응답이 도착한 후에 실행됩니다.
// 주로 401 Unauthorized 에러 발생 시 토큰 갱신 로직을 처리하는 데 사용됩니다.
// (현재는 토큰 갱신 로직이 useAuth.js에 있으므로 여기서는 간단히 응답을 통과시킵니다.)
api.interceptors.response.use(
  (response) => response, // 응답이 성공적이면 그대로 반환
  async (error) => {
    // 응답이 실패한 경우 (예: 401, 403, 500 등)
    // 에러를 콘솔에 로깅하거나, 특정 상태 코드에 따라 추가적인 처리를 할 수 있습니다.
    // 예를 들어, 401 에러 시 토큰 갱신 로직은 useAuth.js의 login 함수 내부에 이미 구현되어 있습니다.
    // 여기서는 기본적으로 에러를 다시 던져서 호출한 곳에서 처리하도록 합니다.
    return Promise.reject(error);
  }
);

// 설정된 Axios 인스턴스를 내보냅니다.
// 다른 컴포넌트나 훅에서 API 호출 시 이 'api' 인스턴스를 임포트하여 사용해야 합니다.
export default api;
