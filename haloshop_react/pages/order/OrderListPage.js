import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('주문 목록 조회 실패!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);s

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>주문 목록</h2>
      {orders.length === 0 ? (
        <p>등록된 주문이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Account ID</th>
              <th>Delivery ID</th>
              <th>Total Price</th>
              <th>Used</th>
              <th>Payment Status</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.accountId}</td>
                <td>{order.deliveryId}</td>
                <td>{order.totalPrice}</td>
                <td>{order.used}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.createdAt}</td>
                <td>{order.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListPage;
