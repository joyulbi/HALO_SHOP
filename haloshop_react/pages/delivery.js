import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import DeliveryForm from '../components/DeliveryForm';
import DeliveryTrackingList from '../components/DeliveryTrackingList';

const DeliveryPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  }, [authLoading, isLoggedIn, router]);

  if (authLoading) return <p>로딩 중...</p>;

  return (
    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <div>
            <h2>배송 정보 입력</h2>
            <DeliveryForm accountId={user?.id} onSubmitSuccess={() => window.location.reload()} />

            <hr />

            <DeliveryTrackingList accountId={user?.id} />  {/* user.id 사용 */}
        </div>
    </div>
  );
};

export default DeliveryPage;
