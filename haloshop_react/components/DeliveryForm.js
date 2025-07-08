import React, { useState } from 'react';
import axios from '../utils/axios';

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
      await axios.post('http://localhost:8080/api/delivery', {
        ...form,
        accountId,
      });
      alert('배송지 등록 완료');
      onSubmitSuccess?.();
    } catch (err) {
      console.error(err);
      alert('배송지 등록 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="recipientName" placeholder="수령자 이름" onChange={handleChange} style={{ marginRight: '8px' }} required />
      <input name="zipcode" placeholder="우편번호" onChange={handleChange} style={{ marginRight: '8px' }} required />
      <input name="address" placeholder="주소" onChange={handleChange} style={{ marginRight: '8px' }} required />
      <input name="addressDetail" placeholder="상세 주소" onChange={handleChange} style={{ marginRight: '8px' }} required />
      <button type="submit">배송지 등록</button>
    </form>
  );
};

export default DeliveryForm;
