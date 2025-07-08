import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

const DeliveryList = ({ accountId, onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);  // ✅ 선택된 배송지 ID

  // ✅ 배송지 목록 불러오기 함수
  const fetchAddresses = async () => {
    try {
      const res = await api.get(`/api/deliveries/${accountId}`);
      setAddresses(res.data);
    } catch (err) {
      console.error('배송지 목록 불러오기 실패:', err);
    }
  };

  // ✅ 첫 렌더링 및 accountId 변경 시 목록 로드
  useEffect(() => {
    if (accountId) {
      fetchAddresses();
    }
  }, [accountId]);

  if (addresses.length === 0) {
    return <p style={{ margin: '8px 0', color: '#888' }}>등록된 배송지가 없습니다.</p>;
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h4 style={{ marginBottom: '8px' }}>등록된 배송지</h4>
      {addresses.map((addr) => (
        <div
          key={addr.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            marginBottom: '8px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            backgroundColor: selectedId === addr.id ? '#e0f7fa' : '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <div>
            <strong>{addr.recipientName}</strong> | {addr.address} {addr.addressDetail} ({addr.zipcode})
          </div>
          <button
            onClick={() => {
              setSelectedId(addr.id); // ✅ 선택된 배송지 ID 저장
              onSelect(addr);         // ✅ 부모로 선택한 배송지 전달
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: selectedId === addr.id ? '#4f46e5' : '#f3f4f6',
              color: selectedId === addr.id ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {selectedId === addr.id ? '선택됨' : '선택'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DeliveryList;
