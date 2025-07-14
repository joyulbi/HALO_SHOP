import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext'; // 🔥 추가
import NotificationIcon from "./NotificationIcon";
import ChatBot from "./ChatBot";

const QuickMenu = ({ cartRef }) => {
  const router = useRouter();
  const { cartCount } = useCart(); // 🔥 cartCount 상태 불러오기

  const goToCart = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    router.push('/cart');
  };

  const goToCheckout = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    router.push('/checkout');
  };

  const goToAttendance = () => {
    router.push('/attendance');
  }

  // 알림창 온오프
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <div className="quick-menu" style={{ position: 'fixed', right: '20px', top: '200px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button
        title="결제"
        onClick={goToCheckout}
        style={{ width: '50px', height: '50px', borderRadius: '50%', fontSize: '24px', cursor: 'pointer' }}
      >
        💳
      </button>

      <button
      ref={cartRef}
        title="장바구니"
        onClick={goToCart}
        style={{ width: '50px', height: '50px', borderRadius: '50%', fontSize: '24px', cursor: 'pointer', position: 'relative' }}
      >
        🛒
        {cartCount > 0 && ( // 🔥 장바구니 개수 표시
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px'
          }}>
            {cartCount}
          </span>
        )}
      </button>

      <button
        title="마이페이지"
        disabled // 다른 사람이 작업 중
        style={{ width: '50px', height: '50px', borderRadius: '50%', fontSize: '24px', cursor: 'pointer' }}
      >
        👤
      </button>
      <NotificationIcon />
      <button
        title="출석"
        onClick={goToAttendance}
        style={{ width: '50px', height: '50px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}
        >📅</button>
      <ChatBot />
    </div>
  );
};

export default QuickMenu;
