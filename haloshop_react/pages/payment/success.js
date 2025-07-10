import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useCart } from '../../context/CartContext';

export default function SuccessPage() { // 이름도 KakaoSuccessPage -> SuccessPage로 변경 권장
  const router = useRouter();
  const { pg_token, accountId, orderId: orderIdParam } = router.query; // ✅ orderIdParam 추가
  const { refreshCart, setCartCount } = useCart();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;

    const approvePayment = async () => {
      try {
        let orderId;

        if (pg_token) {
          // ✅ 카카오페이 결제 승인
          const res = await axios.post('/api/payment/approve', {
            pgToken: pg_token,
            accountId: Number(accountId),
          });
          orderId = res.data; // 승인 후 orderId 수신
        } else if (orderIdParam) {
          // ✅ 카드(Mock) 결제는 이미 승인 완료 상태
          orderId = orderIdParam;
        } else {
          alert('결제 정보가 부족합니다.');
          router.push('/cart');
          return;
        }

        // ✅ 장바구니 비우기 및 뱃지 초기화
        try {
          await refreshCart();
          await new Promise(resolve => setTimeout(resolve, 100));
          setCartCount(0);
        } catch (e) {
          console.error('refreshCart() 실패:', e);
        }

        alert('결제가 완료되었습니다!');
        router.push(`/mypage/orders/${orderId}`);
      } catch (error) {
        console.error('결제 승인 실패 디버깅:', error.response?.data || error);
        alert('결제 승인 실패');
        router.push('/order/fail');
      } finally {
        setLoading(false);
      }
    };

    approvePayment();
  }, [pg_token, accountId, orderIdParam, refreshCart, setCartCount, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading ? '결제 처리 중입니다...' : '처리가 완료되었습니다.'}
    </div>
  );
}
