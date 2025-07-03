// /pages/mypage/edit.js

import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

const EditUserProfile = () => {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
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
      router.replace('/admin/mypage/edit'); // 관리자면 어드민 전용 페이지로
      return;
    }
    api.get('/user/me').then(res => {
      const info = res.data.user || {};
      setForm({
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
      await api.patch('/user/me', form);
      setMsg('정보가 성공적으로 수정되었습니다!');
      setTimeout(() => router.push('/mypage'), 1000);
    } catch (err) {
      setMsg('수정에 실패했습니다. ' + (err.response?.data || ''));
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ maxWidth: 440, margin: "auto", padding: "32px 0" }}>
      <h2 style={{ marginBottom: 20 }}>내 정보 수정</h2>
      <form onSubmit={handleSubmit}>
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
