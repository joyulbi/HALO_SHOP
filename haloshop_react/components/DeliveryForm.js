import React, { useState } from 'react';
import api from '../utils/axios';

const DeliveryForm = ({ accountId, onSubmitSuccess }) => {
  const [form, setForm] = useState({
    address: '',
    addressDetail: '',
    zipcode: '',
    recipientName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/deliveries', {
        ...form,
        accountId,
      });
      alert('배송지 등록 완료');
      onSubmitSuccess?.(); // 새로고침 또는 리스트 리로드
    } catch (err) {
      console.error(err);
      alert('배송지 등록 실패');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px',
      }}
    >
      <input
        name="recipientName"
        placeholder="수령자 이름"
        onChange={handleChange}
        required
        style={{ flex: '1 1 200px', padding: '8px' }}
      />
      <input
        name="zipcode"
        placeholder="우편번호"
        onChange={handleChange}
        required
        style={{ flex: '1 1 120px', padding: '8px' }}
      />
      <input
        name="address"
        placeholder="주소"
        onChange={handleChange}
        required
        style={{ flex: '1 1 300px', padding: '8px' }}
      />
      <input
        name="addressDetail"
        placeholder="상세 주소"
        onChange={handleChange}
        required
        style={{ flex: '1 1 300px', padding: '8px' }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        배송지 등록
      </button>
    </form>
  );
};

export default DeliveryForm;
