import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

const MyPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/me');
        setProfile(res.data); // res.data = { user: {...}, account: {...} }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  if (loading) return <div>로딩중...</div>;
  if (!isLoggedIn) return <div>로그인 후 이용하세요.</div>;

  return (
    <div>
      <h1>내 정보</h1>
      {/* account, user 객체에서 각각 필요한 정보 꺼내기 */}
      <p>닉네임: {profile?.account?.nickname || user?.nickname}</p>
      <p>이메일: {profile?.account?.email || user?.email}</p>
      <p>주소: {profile?.user?.address || '등록된 주소 없음'}</p>
      <p>상세주소: {profile?.user?.addressDetail || '등록된 상세주소 없음'}</p>
      <p>우편번호: {profile?.user?.zipcode || '없음'}</p>
      <p>생년월일: {profile?.user?.birth ? new Date(profile.user.birth).toLocaleDateString() : '없음'}</p>
      <p>성별: {profile?.user?.gender || '없음'}</p>
      {/* 필요하면 더 추가 */}
    </div>
  );
};

export default MyPage;
