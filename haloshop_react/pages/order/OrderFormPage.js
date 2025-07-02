import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useRouter } from 'next/router';

const OrderFormPage = () => {
  const router = useRouter();

  const [order, setOrder] = useState({
    accountId: '',
    deliveryId: '',
    used: 'CARD',
    paymentStatus: 'PENDING',
    amount: ''
  });

  const [items, setItems] = useState([
    { itemId: '', itemName: '', productPrice: '', quantity: '' }
  ]);

  const [loading, setLoading] = useState(false);

  const handleOrderChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { itemId: '', itemName: '', productPrice: '', quantity: '' }]);
  };

  const calculateTotalPrice = () => {
    return items.reduce((acc, item) => {
      const price = Number(item.productPrice) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + price * quantity;
    }, 0);
  };

  const validateForm = () => {
    if (!order.accountId || !order.deliveryId) {
      alert('Account ID와 Delivery ID를 입력해주세요.');
      return false;
    }
    if (items.length === 0 || items.some(item => !item.itemId || !item.productPrice || !item.quantity)) {
      alert('모든 아이템 정보를 입력해주세요.');
      return false;
    }
    const total = calculateTotalPrice();
    if ((Number(order.amount) || 0) > total) {
      alert('사용 포인트가 결제 금액을 초과할 수 없습니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        ...order,
        accountId: Number(order.accountId),
        deliveryId: Number(order.deliveryId),
        amount: Number(order.amount) || 0,
        totalPrice: calculateTotalPrice(),
        orderItems: items.map(item => ({
          itemId: Number(item.itemId),
          itemName: item.itemName,
          productPrice: Number(item.productPrice),
          quantity: Number(item.quantity)
        }))
      };

      if (order.used === 'KAKAOPAY') {
        const res = await axios.post('/api/orders/kakao/ready', payload);
        window.location.href = res.data.next_redirect_pc_url;
      } else {
        await axios.post('/api/orders', payload);
        alert('주문이 완료되었습니다!');
        router.push('/order/complete');
      }
    } catch (error) {
      console.error(error);
      alert('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">주문 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Account ID</label>
          <input name="accountId" value={order.accountId} onChange={handleOrderChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Delivery ID</label>
          <input name="deliveryId" value={order.deliveryId} onChange={handleOrderChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">결제 수단</label>
          <select name="used" value={order.used} onChange={handleOrderChange} className="border p-2 w-full">
            <option value="CARD">카드(Mock)</option>
            <option value="KAKAOPAY">카카오페이</option>
            
          </select>
        </div>
        <div>
          <label className="block mb-1">사용할 포인트</label>
          <input name="amount" value={order.amount} onChange={handleOrderChange} placeholder="사용할 포인트 금액" className="border p-2 w-full" />
        </div>
        <p>총 합계: {calculateTotalPrice()} 원</p>
        <p>포인트 사용 후 결제 금액: {calculateTotalPrice() - (Number(order.amount) || 0)} 원</p>

        <h3 className="text-lg font-semibold mt-4">주문 아이템</h3>
        {items.map((item, index) => (
          <div key={index} className="space-y-2 border p-2 mb-2">
            <input
              name="itemId"
              placeholder="Item ID"
              value={item.itemId}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-1 w-full"
            />
            <input
              name="itemName"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-1 w-full"
            />
            <input
              name="productPrice"
              placeholder="Product Price"
              value={item.productPrice}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-1 w-full"
            />
            <input
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-1 w-full"
            />
          </div>
        ))}
        <button type="button" onClick={addItem} className="bg-gray-200 px-3 py-1 rounded">아이템 추가</button>
        <div>
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            {loading ? '주문 처리 중...' : '주문하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFormPage;