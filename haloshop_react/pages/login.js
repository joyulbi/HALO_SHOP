import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN_REQUEST } from '../reducers/user_YG';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { logInLoading, logInError, logInDone, isLogin } = useSelector((state) => state.user_YG);
  const { login: jwtLogin, isLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { fetchCartCount } = useCart();

  useEffect(() => {
    if (isLogin || isLoggedIn) {
      router.replace('/');
    }
  }, [isLogin, isLoggedIn]);

  useEffect(() => { if (logInDone) setMessage('세션 로그인 성공!'); }, [logInDone]);
  useEffect(() => { if (logInError) setError(logInError); }, [logInError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');

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
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Container>
        <Title>Halo Shop</Title>
        <Form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={logInLoading}>
            {logInLoading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>
        {message && <Message success>{message}</Message>}
        {error && <Message>{error}</Message>}
      </Container>
    </>
  );
}

// Dior 무드 스타일 (크기 조정)
const Container = styled.div`
  max-width: 600px;   /* 기존 400px에서 600px로 확장 */
  margin: 80px auto;
  padding: 60px;      /* 패딩 확장으로 내부 여백 증가 */
  background-color: #f6f5f3;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border-radius: 12px;
`;

const Title = styled.h2`
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;  /* 폰트 크기 증가 */
  color: #000;
  margin-bottom: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;  /* 입력 필드 패딩 증가 */
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.1rem;  /* 폰트 크기 약간 키움 */
  &:focus {
    outline: none;
    border-color: #b4975a;
    box-shadow: 0 0 0 2px rgba(180,151,90,0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 0;     /* 버튼 높이 증가 */
  background-color: #b4975a;
  color: #fff;
  font-size: 1.1rem;  /* 버튼 텍스트 크기 증가 */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #a07e43;
  }
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: 1rem;
  color: ${(props) => (props.success ? '#228B22' : '#c8102e')};
`;

