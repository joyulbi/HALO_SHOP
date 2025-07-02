import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';

const InventoryEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [inventory, setInventory] = useState(null);
  const [inventoryVolume, setInventoryVolume] = useState(0);
  const [stockVolume, setStockVolume] = useState(0);

  // 입고 내역 가져오기
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

  // 재고 수정
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

  // 재고 삭제
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
    <div style={{ padding: '20px' }}>
      <h1>재고 수정 페이지</h1>
      <p>상품명: {inventory.itemName}</p>
      <p>상품 ID: {inventory.items_id}</p>

      <div style={{ marginBottom: '10px' }}>
        <label>총 재고량: </label>
        <input
          type="number"
          value={inventoryVolume}
          readOnly
          style={{ marginLeft: '10px', backgroundColor: '#f0f0f0' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>입고량: </label>
        <input
          type="number"
          value={stockVolume}
          onChange={(e) => setStockVolume(Number(e.target.value))}
          style={{ marginLeft: '10px' }}
        />
      </div>

      <button onClick={handleUpdate} style={{ marginRight: '10px' }}>저장</button>
      <button onClick={handleDelete} style={{ marginRight: '10px' }}>삭제</button>
      <button onClick={() => router.push('/admin/inventory')}>뒤로가기</button>
    </div>
  );
};

export default InventoryEditPage;
