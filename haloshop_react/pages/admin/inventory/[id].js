import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import AdminLayout from '../AdminLayout';

const InventoryEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [inventory, setInventory] = useState(null);
  const [inventoryVolume, setInventoryVolume] = useState(0);
  const [stockVolume, setStockVolume] = useState(0);

  useEffect(() => {
    if (id) {
      api.get(`/api/admin/inventory`)
        .then(res => {
          const found = res.data.find(item => item.id === parseInt(id));
          if (found) {
            setInventory(found);
            setInventoryVolume(found.inventory_volume);
            setStockVolume(found.stock_volume);
          }
        })
        .catch(err => console.error('재고 조회 실패:', err));
    }
  }, [id]);

  const handleUpdate = () => {
    api.put(`/api/admin/inventory/${id}`, {
      inventoryVolume: inventoryVolume,
      stockVolume: stockVolume
    })
      .then(() => {
        alert('재고 수정 성공!');
        router.push('/admin/inventory');
      })
      .catch(err => console.error('재고 수정 실패:', err));
  };

  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    api.delete(`/api/admin/inventory/${id}`)
      .then(() => {
        alert('재고 삭제 성공!');
        router.push('/admin/inventory');
      })
      .catch(err => console.error('재고 삭제 실패:', err));
  };

  if (!inventory) return <div>로딩중...</div>;

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
        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>재고 수정</h2>

        <div style={{ marginBottom: '20px', fontSize: '16px' }}>
          <p><strong>상품명:</strong> {inventory.itemName}</p>
          <p><strong>상품 ID:</strong> {inventory.items_id}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>총 재고량</label>
          <input
            type="number"
            value={inventoryVolume}
            readOnly
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#f0f0f0'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>입고량</label>
          <input
            type="number"
            value={stockVolume}
            onChange={(e) => setStockVolume(Number(e.target.value))}
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
            onClick={handleUpdate}
            style={{
              background: '#28a745',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            저장
          </button>

          <button
            onClick={handleDelete}
            style={{
              background: '#dc3545',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            삭제
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
            뒤로가기
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InventoryEditPage;
