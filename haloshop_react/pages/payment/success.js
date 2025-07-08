import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useCart } from '../../context/CartContext';

export default function KakaoSuccessPage() {
  const router = useRouter();
  const { pg_token, accountId } = router.query;
  const { refreshCart } = useCart();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pg_token || !accountId) return;

    const approvePayment = async () => {
      try {
        await axios.post('/api/payment/approve', {
          pgToken: pg_token,
          accountId: Number(accountId),
        });

        try {
          await refreshCart();
          await new Promise(resolve => setTimeout(resolve, 100)); // ✅ 딜레이 추가
        } catch (e) {
          console.error('refreshCart() 실패:', e);
        }

        alert('결제 완료!');
        router.push('/mypage/orders');
      } catch (error) {
        console.error('결제 승인 실패 디버깅:', error.response?.data || error);
        alert('결제 승인 실패');
        router.push('/order/fail');
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
