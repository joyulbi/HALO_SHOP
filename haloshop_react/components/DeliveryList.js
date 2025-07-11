import React from 'react';

// 배송지 항목을 스타일링하는 객체
const deliveryItemStyle = (selected) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  marginBottom: '8px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: selected ? '#e0f7fa' : '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
});

// 버튼 스타일링 객체
const buttonStyle = (selected) => ({
  padding: '6px 12px',
  backgroundColor: selected ? '#4f46e5' : '#f3f4f6',
  color: selected ? '#fff' : '#333',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
});

const DeliveryList = ({ addresses, onSelect, selectedAddressId, defaultAddressId }) => {
  if (!addresses || addresses.length === 0) {
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

      {/* 기본 배송지 표시 */}
      <div
        style={deliveryItemStyle(defaultAddressId === selectedAddressId)} // 기본 배송지 스타일
      >
        <div>
          <strong>기본 배송지:</strong> {addresses.find(addr => addr.id === defaultAddressId)?.recipientName} | 
          {addresses.find(addr => addr.id === defaultAddressId)?.address} 
          {addresses.find(addr => addr.id === defaultAddressId)?.addressDetail} 
          ({addresses.find(addr => addr.id === defaultAddressId)?.zipcode})
        </div>
        <button
          onClick={() => onSelect(addresses.find(addr => addr.id === defaultAddressId))}
          style={buttonStyle(defaultAddressId === selectedAddressId)}
        >
          {defaultAddressId === selectedAddressId ? '선택됨' : '선택'}
        </button>
      </div>

      {/* 다른 배송지들 표시 */}
      {addresses.map((addr) => (
        <div
          key={addr.id}
          style={deliveryItemStyle(selectedAddressId === addr.id)}  // 선택된 배송지 ID와 비교
        >
          <div>
            <strong>{addr.recipientName}</strong> | {addr.address} {addr.addressDetail} ({addr.zipcode})
          </div>
          <button
            onClick={() => onSelect(addr)}  // onSelect는 부모에서 상태를 업데이트하도록
            style={buttonStyle(selectedAddressId === addr.id)}  // 선택된 상태에 맞는 스타일 적용
          >
            {selectedAddressId === addr.id ? '선택됨' : '선택'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DeliveryList;
