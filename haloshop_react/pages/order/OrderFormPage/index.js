import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import { useRouter } from 'next/router';
import DeliveryForm from '../../../components/DeliveryForm';
import { useAuth } from '../../../hooks/useAuth';

const OrderFormPage = () => {
  const router = useRouter();
  const { itemId, quantity } = router.query;
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [order, setOrder] = useState({
    accountId: '',
    used: 'CARD',
    paymentStatus: 'PENDING',
  });

  const [items, setItems] = useState([]);
  const [point, setPoint] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ accountId를 useAuth 기반으로 설정
  useEffect(() => {
    if (authLoading) return; // 유저 정보 로딩 중일 땐 대기

    if (!isLoggedIn || !user?.id) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    setOrder(prev => ({
      ...prev,
      accountId: user.id
    }));
  }, [authLoading, isLoggedIn, user, router]);

  // 아이템 정보 가져오기
  useEffect(() => {
    const fetchItem = async () => {
      if (itemId) {
        try {
          const res = await axios.get(`/api/items/${itemId}`);
          const itemData = res.data;
          setItems([{
            itemId: itemData.id,
            itemName: itemData.name,
            productPrice: itemData.price,
            quantity: quantity ? Number(quantity) : 1
          }]);
        } catch (error) {
          console.error('상품 정보 불러오기 실패:', error);
        }
      }
    };
    fetchItem();
  }, [itemId, quantity]);

  const calculateTotalPrice = () => {
    return items.reduce((acc, item) => {
      const price = Number(item.productPrice) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);
  };

  const formatKRW = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const totalPrice = calculateTotalPrice();
      const payAmount = totalPrice - point;

      if (!order.accountId) {
        alert("로그인 후 시도해주세요.");
        setLoading(false);
        return;
      }

if (order.used === 'KAKAOPAY') {
  const res = await axios.post('/api/payment/ready', {
    accountId: Number(order.accountId),
    used: order.used,
    totalPrice,
    payAmount,
    amount: point
  });
  window.location.href = res.data.next_redirect_pc_url;
} else {
  const payload = {
    ...order,
    accountId: Number(order.accountId),
    totalPrice,
    payAmount,
    amount: point,
    orderItems: items.map(item => ({
      itemId: Number(item.itemId),
      itemName: item.itemName,
      productPrice: Number(item.productPrice),
      quantity: Number(item.quantity)
    }))
  };

  const res = await axios.post('/api/orders', payload);
  alert('주문이 완료되었습니다!');
  router.push(`/order/${res.data.orderId}`);
}

    } catch (error) {
      console.error(error);
      alert('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center">유저 정보를 불러오는 중...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 max-w-6xl mx-auto font-sans text-gray-800">
      {/* 주문 정보 */}
      <div>
        {/* 가격 요약 */}
        <div className="text-sm space-y-1 mb-8">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatKRW(calculateTotalPrice())}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatKRW(calculateTotalPrice() - point)}</span>
          </div>
        </div>

        {/* 포인트 사용 */}
        <div className="flex items-center gap-3 mb-6">
          <h4>포인트 사용</h4>
          <input
            type="number"
            value={point}
            onChange={(e) => setPoint(Number(e.target.value) || 0)}
            placeholder="포인트 사용"
            className="flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring"
          />
        </div>

        {/* 주문 아이템 */}
        <h3 className="text-lg font-semibold mb-4">주문 아이템</h3>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 border p-3 mb-3 rounded-md">
            <input value={item.itemId} readOnly className="border p-2 rounded-md text-center" />
            <input value={item.itemName} readOnly className="border p-2 rounded-md text-center" />
            <input value={item.productPrice} readOnly className="border p-2 rounded-md text-center" />
            <input value={item.quantity} readOnly className="border p-2 rounded-md text-center" />
          </div>
        ))}
      </div>

      {/* 배송/결제 */}
      <div className="text-right">
        <h2 className="text-2xl font-bold mb-4">Delivery</h2>
        <DeliveryForm />

        <h2 className="text-2xl font-bold my-4">Payment</h2>
        <div className="bg-gray-100 p-6 rounded-md inline-block text-left w-full max-w-md ml-auto shadow-md">
          <div className="flex items-center justify-between border p-3 bg-white rounded-md">
            <select
              name="used"
              value={order.used}
              onChange={(e) => setOrder(prev => ({ ...prev, used: e.target.value }))}
              className="w-full bg-transparent focus:outline-none"
            >
              <option value="CARD">Credit Card</option>
              <option value="KAKAOPAY">카카오페이</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-black text-white py-3 px-6 rounded-md shadow hover:opacity-90"
        >
          {loading ? '처리 중...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

export default OrderFormPage;
