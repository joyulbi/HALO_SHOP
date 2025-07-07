import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';

export default function KakaoSuccessPage() {
  const router = useRouter();
  const { pg_token, accountId } = router.query;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // router.query 는 hydration 이전에 undefined일 수 있으므로 검사
    if (!pg_token || !accountId) return;

    const approvePayment = async () => {
      try {
        await axios.post('/api/payment/approve', {
          pgToken: pg_token,
          accountId: Number(accountId),
        });
        alert('결제 완료!');
        router.push('/mypage/orders');
      } catch (error) {
        console.error(error);
        alert('결제 승인 실패');
        router.push('/order/fail'); // 실패 페이지
      } finally {
        setLoading(false);
      }
    };

    approvePayment();
  }, [pg_token, accountId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading ? '결제 승인 중입니다...' : '처리가 완료되었습니다.'}
    </div>
  );
}
