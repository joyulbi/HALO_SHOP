// pages/admin/delivery/index.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

const AdminDeliveryPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const SERVER_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = () => {
    axios.get(`${SERVER_URL}/api/admin/deliveries`)
      .then((res) => setDeliveries(res.data))
      .catch((err) => console.error('배송 목록 불러오기 실패', err));
  };

  const handleStatusChange = (orderItemId, newStatus) => {
    axios.put(`${SERVER_URL}/api/admin/deliveries/${orderItemId}/status`, { status: newStatus })
      .then(() => {
        alert('배송 상태가 수정되었습니다.');
        fetchDeliveries(); // 상태 변경 후 목록 새로고침
      })
      .catch((err) => console.error('배송 상태 수정 실패', err));
  };

  return (
    <AdminLayout>
    <div style={{ padding: '32px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>📦 배송 현황</h2>

      {deliveries.length === 0 ? (
        <p style={{ color: '#777' }}>배송 내역이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {deliveries.map((item) => (
            <div
              key={item.orderItemId}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '16px',
                background: '#fafafa',
              }}
            >
              {/* 이미지 */}
              <div>
                {item.imageUrl ? (
                  <img
                    src={`${SERVER_URL}${item.imageUrl}`}
                    alt="상품 이미지"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '14px',
                    }}
                  >
                    이미지 없음
                  </div>
                )}
              </div>

              {/* 정보 */}
              <div style={{ flexGrow: 1 }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>
                  [{item.productName}]
                </p>
                <p style={{ margin: '4px 0', color: '#555' }}>
                  주문일: {item.orderDate ? new Date(item.orderDate).toLocaleDateString() : 'N/A'} <br />
                  운송장번호: {item.trackingNumber || '없음'} <br />
                  택배사: {item.carrier || '없음'}
                </p>
              </div>

              {/* 배송상태 수정 */}
              <div>
                <select
                  value={item.deliveryStatus}
                  onChange={(e) => handleStatusChange(item.orderItemId, e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    fontWeight: 'bold',
                    color: item.deliveryStatus === '배송완료' ? '#4caf50' : '#ff9800',
                  }}
                >
                  <option value="배송준비중">배송준비중</option>
                  <option value="출고됨">출고됨</option>
                  <option value="배송중">배송중</option>
                  <option value="배송완료">배송완료</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminDeliveryPage;
