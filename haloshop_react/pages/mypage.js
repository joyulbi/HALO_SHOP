import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Space, Divider, Spin } from 'antd';
import { UserOutlined, ShoppingCartOutlined, OrderedListOutlined, TruckOutlined, StarOutlined, LockOutlined, DollarOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import api from '../utils/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const { Sider, Content } = Layout;
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

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }} />;
  if (!isLoggedIn) return <div style={{ textAlign: 'center', marginTop: '150px' }}>로그인 후 이용하세요.</div>;
  if (error) return <div style={{ color: 'crimson', textAlign: 'center', marginTop: '150px' }}>{error}</div>;
  if (!profile) return <div style={{ textAlign: 'center', marginTop: '150px' }}>회원 정보 없음</div>;

  const account = profile.account || {};
  const admin = profile.admin;
  const userInfo = profile.user;

  const menuItems = [
    { key: 'profile', label: '프로필', icon: <UserOutlined />, onClick: () => router.push('/mypage') },
    { key: 'orders', label: '주문 내역', icon: <OrderedListOutlined />, onClick: () => router.push('/mypage/orders') },
    { key: 'reviews', label: '작성한 리뷰', icon: <StarOutlined />, onClick: () => router.push('/my-reviews') },
    { key: 'delivery', label: '배송 현황', icon: <TruckOutlined />, onClick: () => router.push('/delivery') },
    { key: 'cart', label: '장바구니', icon: <ShoppingCartOutlined />, onClick: () => router.push('/cart') },
    { key: 'password', label: '비밀번호 변경', icon: <LockOutlined />, onClick: () => router.push('/mypage/password') },
    { key: 'auction', label: '낙찰 결과', icon: <DollarOutlined />, onClick: () => router.push('/mypage/auction-result') },
  ];

  return (
    <>
      <Header />

      <Layout style={{ minHeight: 'calc(100vh - 160px)', marginTop: '80px' }}>
        <Sider width={220} style={{ background: '#fff', borderRight: '1px solid #e0e0e0' }}>
          <div style={{ padding: '24px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
            My Page
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['profile']}
            items={menuItems}
            style={{ borderRight: 0 }}
          />
        </Sider>

        <Content style={{ padding: '40px 60px', background: '#f0f4f8' }}>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <Card
      style={{
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        padding: '50px',
        maxWidth: '720px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
        textAlign: 'center',
        transition: 'box-shadow 0.3s',
      }}
      hoverable
    >
      <Avatar
        size={120}
        icon={<UserOutlined />}
        style={{
          marginBottom: '16px',
          backgroundColor: '#c8102e',
          border: '4px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />
      <Title level={3} style={{ marginBottom: '8px', fontWeight: 600 }}>
        {account.nickname || user?.nickname || '-'} {admin && <span style={{ fontSize: '16px', color: '#999' }}>(Admin)</span>}
      </Title>
      <Text type="secondary" style={{ fontSize: '16px' }}>{account.email || user?.email || '-'}</Text>

      <Divider />

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
  {userInfo && (
    <>
      <Text strong>주소</Text>
      <Text>{userInfo.address || '등록된 주소 없음'}</Text>
      <Text>{userInfo.addressDetail || ''}</Text>
      <Text>{userInfo.zipcode || ''}</Text>
      <Text>{userInfo.birth ? new Date(userInfo.birth).toLocaleDateString() : ''}</Text>
      <Text>{userInfo.gender || ''}</Text>
    </>
  )}

  {profile.userPointDto && (
    <>
      <Divider />
      <Text strong>멤버십 등급</Text>
      <Text>{profile.userPointDto.grade || '등급 정보 없음'}</Text>

      <Text strong>보유 포인트</Text>
      <Text>{profile.userPointDto.totalPoint?.toLocaleString() || 0} P</Text>

    </>
  )}

  {admin && (
    <>
      <Divider />
      <Text strong>권한: {admin.role}</Text>
      <Text>계정 상태: {admin.isLocked ? '잠김' : '활성'}</Text>
      <Text>마지막 IP: {admin.lastIp || '정보없음'}</Text>
      <Text>수정일: {admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : '없음'}</Text>
    </>
  )}
</Space>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
      >
        <Button
          type="primary"
          size="large"
          onClick={() => router.push('/mypage/edit')}
          style={{
            borderRadius: 12,
            padding: '10px 30px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          내 정보 수정
        </Button>

        <Button
          type="default"
          size="large"
          danger
          onClick={() => router.push('/mypage/password')}
          style={{
            borderRadius: 12,
            padding: '10px 30px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          비밀번호 변경
        </Button>
      </motion.div>
    </Card>
  </motion.div>
</Content>
      </Layout>

      <Footer />
    </>
  );
};

export default MyPage;
