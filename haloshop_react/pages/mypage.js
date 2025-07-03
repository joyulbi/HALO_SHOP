import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

const MyPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    if (!isLoggedIn) {
      setProfile(null);
      setLoading(false);
      setError('');
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. 관리자 마이페이지
        const adminRes = await api.get('/admin/me');
        if (!cancelled) setProfile(adminRes.data);
      } catch (adminErr) {
        // 2. 어드민 아니면 일반 유저 마이페이지
        try {
          const userRes = await api.get('/user/me');
          if (!cancelled) setProfile(userRes.data);
        } catch (userErr) {
          if (!cancelled) {
            setProfile(null);
            setError('회원 정보를 불러올 수 없습니다.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  if (loading) return <div>로딩중...</div>;
  if (!isLoggedIn) return <div>로그인 후 이용하세요.</div>;
  if (error) return <div style={{ color: 'crimson' }}>{error}</div>;
  if (!profile) return <div>회원 정보 없음</div>;

  // 분기: 어드민/유저 공통 account
  const account = profile.account || {};
  const admin = profile.admin;
  const userInfo = profile.user;

  return (
    <div style={{ maxWidth: 440, margin: "auto", padding: "32px 0" }}>
      <h1 style={{ marginBottom: 20 }}>
        내 정보 {admin ? "(관리자)" : ""}
      </h1>
      <p>닉네임: <b>{account.nickname || user?.nickname || "-"}</b></p>
      <p>이메일: <b>{account.email || user?.email || "-"}</b></p>
      {/* 관리자 정보 */}
      {admin && (
        <>
          <p>관리자 권한 등급: <b>{admin.role}</b></p>
          <p>계정 잠금: <b>{admin.isLocked ? '잠김' : '활성'}</b></p>
          <p>마지막 접속 IP: <b>{admin.lastIp || '정보없음'}</b></p>
          <p>권한 부여자(assignedBy): <b>{admin.assignedBy || '없음'}</b></p>
          <p>마지막 수정일: <b>{admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : '없음'}</b></p>
        </>
      )}
      {/* 일반 유저 정보 */}
      {userInfo && (
        <>
          <p>주소: <b>{userInfo.address || '등록된 주소 없음'}</b></p>
          <p>상세주소: <b>{userInfo.addressDetail || '등록된 상세주소 없음'}</b></p>
          <p>우편번호: <b>{userInfo.zipcode || '없음'}</b></p>
          <p>생년월일: <b>{userInfo.birth ? new Date(userInfo.birth).toLocaleDateString() : '없음'}</b></p>
          <p>성별: <b>{userInfo.gender || '없음'}</b></p>
        </>
      )}
      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
      <button onClick={() => router.push('/mypage/edit')}>
        내 정보 수정
      </button>
      <button onClick={() => router.push('/mypage/password')}>
        비밀번호 변경
      </button>
    </div>
    </div>
  );
};

export default MyPage;
