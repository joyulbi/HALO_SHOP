import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN_REQUEST } from '../reducers/user_YG';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { logInLoading, logInError, logInDone, isLogin } = useSelector((state) => state.user_YG);
  const { login: jwtLogin, isLoggedIn } = useAuth();
  const { fetchCartCount } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLogin || isLoggedIn) {
      router.replace('/');
    }
  }, [isLogin, isLoggedIn]);

  useEffect(() => { if (logInDone) setMessage('세션 로그인 성공!'); }, [logInDone]);
  useEffect(() => { if (logInError) setError(logInError); }, [logInError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const result = await jwtLogin(email, password);
    if (result.success) {
      setMessage('로그인 성공!');
      fetchCartCount();
      return;
    }

    dispatch({ type: LOG_IN_REQUEST, data: { email, password } });
  };

  return (
    <>
      <Head>
        <title>로그인 | Halo Shop</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet" />
      </Head>
      <div style={styles.container}>
        <h2 style={styles.title}>🛍️ Halo Shop</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={logInLoading}>
            {logInLoading ? '로그인 중...' : '로그인'}
          </button>

          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}
        </form>

        {/* 🔻 회원가입 안내 추가 부분 */}
        <div style={styles.signupBox}>
          <p style={styles.signupText}>회원이 아니신가요?</p>
          <button onClick={() => router.push('/signup')} style={styles.signupButton}>회원가입</button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '60px auto',
    padding: '48px 60px',  
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
    fontFamily: "'Noto Sans KR', sans-serif",
    transition: 'all 0.3s ease',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '4px',
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '15px',
    marginBottom: '30px',
    color: '#777',
    letterSpacing: '-0.2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  group: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#333',
    letterSpacing: '-0.3px',
  },
  input: {
  padding: '16px 22px',  // ✅ 넉넉한 여백
  border: '1px solid #d1d1d1',
  borderRadius: '10px', // ✅ 부드러운 모서리
  fontSize: '17px', // ✅ 글씨 조금 키움
  outline: 'none',
  backgroundColor: '#f9f9f9',
  transition: 'all 0.2s ease',
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    backgroundColor: '#c8102e',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 12px rgba(0,0,0,0.06)',
  },
  success: {
    color: 'green',
    marginTop: '24px',
    textAlign: 'center',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    marginTop: '24px',
    textAlign: 'center',
    fontWeight: '500',
  },
  signupBox: {
    marginTop: '36px',
    textAlign: 'center',
  },
  signupText: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '8px',
  },
  signupButton: {
    background: 'none',
    border: 'none',
    color: '#2d7a55',
    fontSize: '15px',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: '600',
  },
};
