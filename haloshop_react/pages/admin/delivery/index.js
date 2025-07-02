// pages/admin/delivery/index.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDeliveryPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const SERVER_URL = 'http://localhost:8080';

  useEffect(() => {
    axios.get(`${SERVER_URL}/api/admin/deliveries`)
      .then((res) => setDeliveries(res.data))
      .catch((err) => console.error('배송 목록 불러오기 실패', err));
  }, []);

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>배송 현황</h2>

      {deliveries.length === 0 ? (
        <p>배송 내역이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {deliveries.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* 이미지 */}
              <div>
                {item.imageUrl ? (
                  <img
                    src={`${SERVER_URL}${item.imageUrl}`}
                    alt="상품 이미지"
                    style={{ width: '100px', borderRadius: '6px' }}
                  />
                ) : (
                  <span style={{ color: '#aaa' }}>이미지 없음</span>
                )}
              </div>
 
              {/* 정보 */}
              <div>
                <p><strong>[{item.productName}]</strong></p>
                <p style={{ marginTop: '4px' }}>배송상태: <strong>{item.deliveryStatus}</strong></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryPage;
