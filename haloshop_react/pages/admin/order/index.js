import React, { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import { useRouter } from 'next/router';
import AdminLayout from '../AdminLayout';

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
    return <div style={{ padding: '40px', textAlign: 'center' }}>주문 목록을 불러오는 중...</div>;
  }

  return (
    <AdminLayout>
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '40px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#222'
      }}>
        🧾 관리자 주문 목록
      </h1>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>
          주문 데이터가 없습니다.
        </p>
      ) : (
        <div style={{ overflowX: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
              <tr>
                {['주문 ID', '유저 ID', '결제 상태', '총 금액', '결제 금액', '결제 수단', '주문일'].map((h) => (
                  <th key={h} style={{ padding: '16px', textAlign: 'left', color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => router.push(`/admin/order/${order.id}`)}
                  style={{
                    borderTop: '1px solid #eee',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={{ padding: '14px' }}>{order.id}</td>
                  <td style={{ padding: '14px' }}>{order.accountId}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      backgroundColor:
                        order.paymentStatus === 'PAID'
                          ? '#d1fae5'
                          : order.paymentStatus === 'PENDING'
                          ? '#fef9c3'
                          : '#fee2e2',
                      color:
                        order.paymentStatus === 'PAID'
                          ? '#047857'
                          : order.paymentStatus === 'PENDING'
                          ? '#92400e'
                          : '#b91c1c'
                    }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {order.totalPrice?.toLocaleString()}원
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {order.payAmount?.toLocaleString()}원
                  </td>
                  <td style={{ padding: '14px' }}>{order.used}</td>
                  <td style={{ padding: '14px' }}>
                    {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminOrderListPage;
