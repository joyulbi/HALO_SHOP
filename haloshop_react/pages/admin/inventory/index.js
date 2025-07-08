import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../utils/axios';
import AdminLayout from '../AdminLayout';

const InventoryListPage = () => {
  const router = useRouter();
  const [inventoryList, setInventoryList] = useState([]);

  const fetchInventoryList = () => {
    api.get('/api/admin/inventory')
      .then(res => setInventoryList(res.data))
      .catch(err => console.error('재고 목록 불러오기 실패:', err));
  };

  useEffect(() => {
    fetchInventoryList();
  }, []);

  const handleEdit = (id) => {
    router.push(`/admin/inventory/${id}`);
  };

  const handleCreate = () => {
    router.push(`/admin/inventory/create`);
  };

  // 🔥 입고 내역 페이지 이동
  const handleHistory = () => {
    router.push(`/admin/inventory/history`);
  };

  return (
    <AdminLayout>
    <div style={{ padding: '20px' }}>
      <h1>재고 관리 페이지</h1>

      {inventoryList.length === 0 ? (
        <>
          <p>등록된 재고가 없습니다.</p>
          <button onClick={handleCreate} style={{ marginTop: '20px', marginRight: '10px' }}>재고 등록</button>
          <button onClick={handleHistory} style={{ marginTop: '20px' }}>입고 내역 보기</button>
        </>
      ) : (
        <>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
            <thead style={{ backgroundColor: '#000', color: '#fff' }}>
              <tr>
                <th>No</th>
                <th>상품명</th>
                <th>상품 ID</th>
                <th>총 재고량</th>
                <th>입고량</th>
                <th>입고 날짜</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {inventoryList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.items_id}</td>
                  <td>{item.inventory_volume}개</td>
                  <td>{item.stock_volume}개</td>
                  <td>{item.created_at}</td>
                  <td>
                    <button style={{ backgroundColor: 'yellow' }} onClick={() => handleEdit(item.id)}>
                      수정
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔥 하단 버튼 */}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleCreate} style={{ marginRight: '10px' }}>재고 등록</button>
            <button onClick={handleHistory}>입고 내역 보기</button>
          </div>
        </>
      )}
    </div>
    </AdminLayout>
  );
};

export default InventoryListPage;
