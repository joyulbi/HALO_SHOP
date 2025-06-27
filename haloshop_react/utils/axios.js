import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Spring Boot 서버 주소
  withCredentials: true // 필요하면 세션/쿠키 연동
});

export default api;
