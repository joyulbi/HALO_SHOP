import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import AdminLayout from '../AdminLayout';

const InventoryCreatePage = () => {
  const router = useRouter();
  const [itemId, setItemId] = useState('');
  const [stockVolume, setStockVolume] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/api/items')
      .then(res => setItems(res.data))
      .catch(err => console.error('상품 목록 불러오기 실패:', err));
  }, []);

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
    <AdminLayout>
      <div style={{
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 0 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>재고 등록</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상품 선택</label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">상품을 선택하세요</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>입고량</label>
          <input
            type="number"
            value={stockVolume}
            onChange={(e) => setStockVolume(e.target.value)}
            placeholder="숫자만 입력"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleRegister}
            style={{
              background: '#007bff',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            등록
          </button>

          <button
            onClick={() => router.push('/admin/inventory')}
            style={{
              background: '#6c757d',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InventoryCreatePage;
