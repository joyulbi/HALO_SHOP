import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import KakaoDraggableMap from './KakaoDraggableMap';

const POSTCODE_SCRIPT_ID = 'kakao-postcode-script';

const DeliveryForm = ({ accountId, onSubmitSuccess }) => {
  const [form, setForm] = useState({
    address: '',
    addressDetail: '',
    zipcode: '',
    recipientName: '',
  });
  const [postcodeReady, setPostcodeReady] = useState(false);

  useEffect(() => {
    if (!document.getElementById(POSTCODE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = POSTCODE_SCRIPT_ID;
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => setPostcodeReady(true);
      script.onerror = () => console.error('❌ 카카오 우편번호 API 로드 실패');
      document.body.appendChild(script);
    } else {
      setPostcodeReady(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = ({ zonecode, address }) => {
    setForm((prev) => ({
      ...prev,
      zipcode: zonecode,
      address: address,
    }));
  };

  const handleSearchAddress = () => {
    if (!postcodeReady || !window.daum?.Postcode) {
      alert('📦 주소 검색 API 로딩 중입니다. 잠시 후 다시 시도하세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        handleAddressSelect({
          zonecode: data.zonecode,
          address: data.address,
        });
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/deliveries', {
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
    <div style={{ display: 'block' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'block',
          marginBottom: '16px',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <input
            name="recipientName"
            placeholder="수령자 이름"
            value={form.recipientName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              name="zipcode"
              placeholder="우편번호"
              value={form.zipcode}
              onChange={handleChange}
              required
              style={{ flex: '1', padding: '8px' }}
              readOnly
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              style={{
                backgroundColor: '#4a90e2',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: postcodeReady ? 'pointer' : 'not-allowed',
                opacity: postcodeReady ? 1 : 0.5,
              }}
              disabled={!postcodeReady}
            >
              📦 주소 검색
            </button>
          </div>
        </div>
        <input
          name="address"
          placeholder="주소"
          value={form.address}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          readOnly
        />
        <input
          name="addressDetail"
          placeholder="상세 주소"
          value={form.addressDetail}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
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

      {/* 지도는 배송지 등록 버튼 아래에 표시 */}
      {form.address && (
        <div style={{ marginTop: '16px' }}>
          <KakaoDraggableMap address={form.address} />
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;
