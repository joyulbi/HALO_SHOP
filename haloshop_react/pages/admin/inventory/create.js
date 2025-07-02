import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';

const InventoryCreatePage = () => {
  const router = useRouter();
  const [itemId, setItemId] = useState('');
  const [stockVolume, setStockVolume] = useState('');
  const [items, setItems] = useState([]);

  // 상품 목록 불러오기
  useEffect(() => {
    api.get('/api/items') // 👉 모든 상품 불러오는 API 필요
      .then(res => setItems(res.data))
      .catch(err => console.error('상품 목록 불러오기 실패:', err));
  }, []);

  // 재고 등록 함수
  const handleRegister = () => {
    if (!itemId || !stockVolume) {
      alert('상품명과 입고량을 모두 선택/입력하세요.');
      return;
    }

    api.post('/api/admin/inventory', {
      itemsId: itemId,
      stockVolume: stockVolume
    })
      .then(() => {
        alert('재고 등록 성공');
        router.push('/admin/inventory');
      })
      .catch(err => {
        console.error('재고 등록 실패:', err);
        alert('재고 등록 실패');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>재고 등록 페이지</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>상품 선택: </label>
        <select value={itemId} onChange={(e) => setItemId(e.target.value)} style={{ marginRight: '20px' }}>
        <option value="">상품을 선택하세요</option>
        {items.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

        <label>입고량: </label>
        <input
          type="number"
          value={stockVolume}
          onChange={(e) => setStockVolume(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>

      <button onClick={handleRegister} style={{ marginRight: '10px' }}>등록</button>
      <button onClick={() => router.push('/admin/inventory')}>취소</button>
    </div>
  );
};

export default InventoryCreatePage;
