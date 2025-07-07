// pages/admin/order/index.js

import React, { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import { useRouter } from 'next/router';

const AdminOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('🚨 관리자 주문 목록 불러오기 실패:', err);
      alert('주문 목록 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">주문 목록을 불러오는 중...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">관리자 주문 목록</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">주문 데이터가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">주문 ID</th>
                <th className="py-3 px-4 text-left">유저 ID</th>
                <th className="py-3 px-4 text-left">결제 상태</th>
                <th className="py-3 px-4 text-left">총 금액</th>
                <th className="py-3 px-4 text-left">결제 금액</th>
                <th className="py-3 px-4 text-left">결제 수단</th>
                <th className="py-3 px-4 text-left">주문일</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/order/${order.id}`)}
                >
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.accountId}</td>
                  <td className="py-2 px-4">
                    <span
                      className={
                        order.paymentStatus === 'PAID'
                          ? 'text-green-600 font-semibold'
                          : order.paymentStatus === 'PENDING'
                          ? 'text-yellow-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-4">{order.totalPrice?.toLocaleString()}원</td>
                  <td className="py-2 px-4">{order.payAmount?.toLocaleString()}원</td>
                  <td className="py-2 px-4">{order.used}</td>
                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderListPage;
