// pages/order/OrderFormPage.js

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useRouter } from 'next/router';
import DeliveryForm from '../../components/DeliveryForm';

const OrderFormPage = () => {
  const router = useRouter();
  const { itemId, quantity, accountId: queryAccountId } = router.query;

  const [order, setOrder] = useState({
    accountId: queryAccountId || '',  // ✅ URL 파라미터로 들어온 경우 자동 세팅
    used: 'CARD',
    paymentStatus: 'PENDING',
  });

  const [items, setItems] = useState([
    { itemId: '', itemName: '', productPrice: '', quantity: '' }
  ]);

  const [point, setPoint] = useState(0);
  const [loading, setLoading] = useState(false);

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
        alert("Account ID를 입력해주세요.");
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 max-w-6xl mx-auto font-sans text-gray-800">
      {/* 주문 정보 */}


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
      <div>
        {/* ✅ Account ID 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Account ID</label>
          <input
            type="number"
            name="accountId"
            value={order.accountId}
            onChange={handleOrderChange}
            placeholder="회원 ID를 입력하세요"
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:border-black"
          />
        </div>
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

        {/* 주문 아이템 */}
        <h3 className="text-lg font-semibold mb-4">주문 아이템</h3>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 border p-3 mb-3 rounded-md">
            <input
              name="itemId"
              placeholder="Item ID"
              value={item.itemId}
              onChange={(e) => handleItemChange(index, e)}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              name="itemName"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => handleItemChange(index, e)}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              name="productPrice"
              placeholder="Product Price"
              value={item.productPrice}
              onChange={(e) => handleItemChange(index, e)}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          아이템 추가
        </button>
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
              onChange={handleOrderChange}
              className="w-full bg-transparent focus:outline-none"
            >
              <option value="CARD">Credit Card</option>
              <option value="KAKAOPAY">카카오페이</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 bg-black text-white py-3 px-6 rounded-md shadow hover:opacity-90"
        >
          {loading ? '처리 중...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default OrderFormPage;
