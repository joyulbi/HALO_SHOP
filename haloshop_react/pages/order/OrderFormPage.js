
import React, { useState } from 'react';
import axios from '../../utils/axios';

const OrderFormPage = () => {
  const [order, setOrder] = useState({
    accountId: '',
    deliveryId: '',
    used: 'CARD',
    paymentStatus: 'PENDING',
    amount: '' // ✅ 포인트 사용 금액
  });

  const [items, setItems] = useState([
    { itemId: '', itemName: '', productPrice: '', quantity: '' }
  ]);

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
      return acc + (price * quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      await axios.post('/api/orders', payload);
      alert('주문이 등록되었습니다!');

      setOrder({
        accountId: '',
        deliveryId: '',
        used: 'CARD',
        paymentStatus: 'PENDING',
        amount: ''
      });
      setItems([{ itemId: '', itemName: '', productPrice: '', quantity: '' }]);
    } catch (error) {
      console.error(error);
      alert('주문 등록 실패!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>주문 등록</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account ID: </label>
          <input name="accountId" value={order.accountId} onChange={handleOrderChange} />
        </div>
        <div>
          <label>Delivery ID: </label>
          <input name="deliveryId" value={order.deliveryId} onChange={handleOrderChange} />
        </div>
        <div>
          <label>사용할 포인트: </label>
          <input
            name="amount"
            value={order.amount}
            onChange={handleOrderChange}
            placeholder="사용할 포인트 금액"
          />
        </div>

        <p>총 합계: {calculateTotalPrice()} 원</p>
        <p>
          포인트 사용 후 결제 금액: {calculateTotalPrice() - (Number(order.amount) || 0)} 원
        </p>

        <h3>주문 아이템</h3>
        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              name="itemId"
              placeholder="Item ID"
              value={item.itemId}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              name="itemName"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              name="productPrice"
              placeholder="Product Price"
              value={item.productPrice}
              onChange={(e) => handleItemChange(index, e)}
            />
            <input
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
            />
          </div>
        ))}
        <button type="button" onClick={addItem}>아이템 추가</button>
        <br /><br />
        <button type="submit">주문하기</button>
      </form>
    </div>
  );
};

export default OrderFormPage;

