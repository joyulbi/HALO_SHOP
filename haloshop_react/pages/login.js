// pages/login.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN_REQUEST } from '../reducers/user_YG';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  // 리덕스 세션 로그인 상태 (관리자용)
  const { logInLoading, logInError, logInDone, isLogin } = useSelector((state) => state.user_YG);
  // useAuth JWT 로그인 상태 (일반 유저용)
  const { login: jwtLogin, isLoggedIn } = useAuth();

  // 입력 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 상태 메시지
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 로그인 성공 시 홈으로 이동
  useEffect(() => {
    if (isLogin || isLoggedIn) {
      router.replace('/');
    }
  }, [isLogin, isLoggedIn]);

  // 세션 로그인 성공 메시지
  useEffect(() => {
    if (logInDone) setMessage('세션 로그인 성공!');
  }, [logInDone]);

  // 세션 로그인 실패 메시지
  useEffect(() => {
    if (logInError) setError(logInError);
  }, [logInError]);

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // 여기서 내부적으로 이메일이 관리자인지 아닌지 백엔드가 판단하도록 위임
    // 일반적으로 관리자 계정도 JWT 또는 세션 로그인 둘 중 하나로 처리하므로
    // 로그인 시 따로 구분하지 않고, 백엔드 권한 체크만 하면 됨

    // 1) 우선 JWT 로그인 시도
    const result = await jwtLogin(email, password);
    if (result.success) {
      setMessage('JWT 로그인 성공!');
      // 이동은 useAuth 내부에서 처리됨
      return;
    }

    // 2) JWT 로그인 실패 시 세션 로그인 시도 (관리자용)
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <button
          type="submit"
          disabled={logInLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#c8102e',
            color: 'white',
            border: 'none',
            cursor: logInLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {logInLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
}
