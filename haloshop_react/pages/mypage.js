import React, { useEffect, useState } from 'react';
import { Button, Typography, Space, Card, Divider, Row, Col, Tag } from 'antd';
import api from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

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
        const adminRes = await api.get('/admin/me');
        if (!cancelled) setProfile(adminRes.data);
      } catch {
        try {
          const userRes = await api.get('/user/me');
          if (!cancelled) setProfile(userRes.data);
        } catch {
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

  const account = profile.account || {};
  const admin = profile.admin;
  const userInfo = profile.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        maxWidth: '960px',
        margin: '80px auto',
        padding: '0 32px',
        background: '#fafafa',
        fontFamily: `'Helvetica Neue', 'Didot', serif`,
      }}
    >
      <Card
        style={{
          borderRadius: '20px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          padding: '48px',
          background: '#fff',
          border: '1px solid #eee',
        }}
      >
        <Title
          level={2}
          style={{
            fontWeight: 500,
            fontSize: '32px',
            marginBottom: '32px',
            color: '#111',
            letterSpacing: '0.5px',
          }}
        >
          My Profile {admin ? '(Admin)' : ''}
        </Title>

        <Space direction="vertical" size={28} style={{ width: '100%' }}>
          <Row>
            <Col span={8}><Text strong>닉네임</Text></Col>
            <Col span={16}><Text>{account.nickname || user?.nickname || '-'}</Text></Col>
          </Row>
          <Row>
            <Col span={8}><Text strong>이메일</Text></Col>
            <Col span={16}><Text>{account.email || user?.email || '-'}</Text></Col>
          </Row>

          {admin && (
            <>
              <Divider />
              <Row>
                <Col span={8}><Text strong>권한</Text></Col>
                <Col span={16}><Text>{admin.role}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>계정 상태</Text></Col>
                <Col span={16}><Text>{admin.isLocked ? '잠김' : '활성'}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>IP</Text></Col>
                <Col span={16}><Text>{admin.lastIp || '정보없음'}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>권한 부여자</Text></Col>
                <Col span={16}><Text>{admin.assignedBy || '없음'}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>수정일</Text></Col>
                <Col span={16}><Text>{admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : '없음'}</Text></Col>
              </Row>
            </>
          )}

          {userInfo && (
            <>
              <Divider />
              <Row>
                <Col span={8}><Text strong>주소</Text></Col>
                <Col span={16}><Text>{userInfo.address || '등록된 주소 없음'}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>상세주소</Text></Col>
                <Col span={16}><Text>{userInfo.addressDetail || '등록된 상세주소 없음'}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>우편번호</Text></Col>
                <Col span={16}><Text>{userInfo.zipcode || '없음'}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>생년월일</Text></Col>
                <Col span={16}><Text>{userInfo.birth ? new Date(userInfo.birth).toLocaleDateString() : '없음'}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>성별</Text></Col>
                <Col span={16}><Text>{userInfo.gender || '없음'}</Text></Col>
              </Row>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <Button
              type="default"
              size="large"
              onClick={() => router.push('/mypage/edit')}
              style={{
                borderRadius: 8,
                padding: '8px 28px',
                fontWeight: 500,
                border: '1px solid #ccc',
              }}
            >
              내 정보 수정
            </Button>
            <Button
              type="text"
              size="large"
              danger
              onClick={() => router.push('/mypage/password')}
              style={{
                fontWeight: 500,
                borderRadius: 8,
              }}
            >
              비밀번호 변경
            </Button>
          </motion.div>
        </Space>
      </Card>
    </motion.div>
  );
};

export default MyPage;
