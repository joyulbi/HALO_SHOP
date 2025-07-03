import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

const EditUserProfile = () => {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',         // ★ 이메일 추가
    nickname: '',
    address: '',
    addressDetail: '',
    zipcode: '',
    birth: '',
    gender: '',
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // 최초 마운트 때 본인 프로필 정보 불러오기
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }
    if (user?.isAdmin) {
      router.replace('/admin/mypage/edit');
      return;
    }
    api.get('/user/me').then(res => {
      const info = res.data.user || {};
      setForm({
        email: res.data.account?.email || '',           // ★ email 세팅
        nickname: res.data.account?.nickname || '',
        address: info.address || '',
        addressDetail: info.addressDetail || '',
        zipcode: info.zipcode || '',
        birth: info.birth ? info.birth.slice(0,10) : '',
        gender: info.gender || '',
      });
      setLoading(false);
    }).catch(() => {
      setMsg('프로필 정보를 불러올 수 없습니다.');
      setLoading(false);
    });
  }, [isLoggedIn, user, router]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

const handleSubmit = async e => {
  e.preventDefault();
  setMsg('');
  try {
    // 1. 토큰 준비 (accessToken, refreshToken 헤더로 넘길 수도)
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    // 2. 요청
    const res = await api.put('/user/me', form, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      }
    });
    // 3. 응답에서 새 토큰 있으면 교체
    if (res.data && res.data.accessToken && res.data.refreshToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
    setMsg('정보가 성공적으로 수정되었습니다!');
    setTimeout(() => router.push('/mypage'), 1000);
  } catch (err) {
    const errorMsg = err?.response?.data?.error || err?.response?.data || '';
    if (
      errorMsg.includes('이미 존재하는 이메일') ||
      errorMsg.toLowerCase().includes('duplicate') ||
      (err?.response?.status === 409)
    ) {
      setMsg('중복된 이메일입니다. 다른 이메일을 입력해주세요.');
    } else {
      setMsg('수정에 실패했습니다. ' + errorMsg);
    }
  }
};


  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ maxWidth: 440, margin: "auto", padding: "32px 0" }}>
      <h2 style={{ marginBottom: 20 }}>내 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <label>이메일<br />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
            autoComplete="username"
          />
        </label><br /><br />
        <label>닉네임<br />
          <input name="nickname" value={form.nickname} onChange={handleChange} required />
        </label><br /><br />
        <label>주소<br />
          <input name="address" value={form.address} onChange={handleChange} />
        </label><br /><br />
        <label>상세주소<br />
          <input name="addressDetail" value={form.addressDetail} onChange={handleChange} />
        </label><br /><br />
        <label>우편번호<br />
          <input name="zipcode" value={form.zipcode} onChange={handleChange} />
        </label><br /><br />
        <label>생년월일<br />
          <input name="birth" type="date" value={form.birth} onChange={handleChange} />
        </label><br /><br />
        <label>성별<br />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="M">남자</option>
            <option value="F">여자</option>
          </select>
        </label><br /><br />
        <button type="submit" style={{ marginTop: 16 }}>정보 수정</button>
      </form>
      {msg && <div style={{ marginTop: 16, color: msg.includes('성공') ? 'green' : 'crimson' }}>{msg}</div>}
    </div>
  );
};

export default EditUserProfile;
