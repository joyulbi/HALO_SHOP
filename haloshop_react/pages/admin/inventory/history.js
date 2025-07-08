import React, { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import AdminLayout from '../AdminLayout';

const InventoryHistoryPage = () => {
  const [inventoryList, setInventoryList] = useState([]);

  // 입고 내역 전체 조회
  const fetchInventoryHistory = () => {
    api.get('/api/admin/inventory')
      .then(res => setInventoryList(res.data))
      .catch(err => console.error('입고 내역 불러오기 실패:', err));
  };

  useEffect(() => {
    fetchInventoryHistory();
  }, []);

  return (
    <AdminLayout>
    <div style={{ padding: '20px' }}>
      <h1>재고 입고 내역 페이지</h1>

      {inventoryList.length === 0 ? (
        <p>입고 내역이 없습니다.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
          <thead style={{ backgroundColor: '#000', color: '#fff' }}>
            <tr>
              <th>No</th>
              <th>상품명</th>
              <th>상품 ID</th>
              <th>입고량</th>
              <th>총 재고량</th>
              <th>입고 날짜</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.itemName}</td>
                <td>{item.items_id}</td>
                <td>{item.stock_volume}개</td>
                <td>{item.inventory_volume}개</td>
                <td>{item.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </AdminLayout>
  );
};

export default InventoryHistoryPage;
