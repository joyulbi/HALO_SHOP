import React, { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import { useRouter } from 'next/router';
import AdminLayout from '../AdminLayout';

const AdminRefundListPage = () => {
  const [refundOrders, setRefundOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRefundOrders = async () => {
    try {
      const res = await api.get('/api/admin/orders?status=REFUND_REQUEST'); // ✅ 환불 요청 상태만 필터링
      setRefundOrders(res.data);
    } catch (err) {
      console.error('🚨 환불 요청 목록 불러오기 실패:', err);
      alert('환불 요청 목록 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRefund = async (orderId) => {
    if (!confirm(`주문 ${orderId} 환불을 승인하시겠습니까?`)) return;
    try {
      await api.post('/api/payment/cancel', { orderId });
      alert('환불이 승인되었습니다.');
      fetchRefundOrders(); // ✅ 목록 갱신
    } catch (e) {
      console.error('🚨 환불 승인 실패:', e);
      alert('환불 승인에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchRefundOrders();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>환불 요청 목록을 불러오는 중...</div>;
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
          🔁 환불 요청 목록
        </h1>

        {refundOrders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>
            환불 요청 중인 주문이 없습니다.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
              <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <tr>
                  {['주문 ID', '유저 ID', '총 금액', '결제 금액', '결제 수단', '환불 요청일', '승인'].map((h) => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', color: '#555' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refundOrders.map((order) => (
                  <tr key={order.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '14px' }}>{order.id}</td>
                    <td style={{ padding: '14px' }}>{order.accountId}</td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>{order.totalPrice?.toLocaleString()}원</td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>{order.payAmount?.toLocaleString()}원</td>
                    <td style={{ padding: '14px' }}>{order.used}</td>
                    <td style={{ padding: '14px' }}>
                      {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button
                        onClick={() => handleApproveRefund(order.id)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        환불 승인
                      </button>
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

export default AdminRefundListPage;
