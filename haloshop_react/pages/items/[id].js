import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/axios';

const ItemDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      api.get(`/api/items/${id}`)
        .then(res => setItem(res.data))
        .catch(err => console.error('상품 상세 불러오기 실패:', err));
    }
  }, [id]);

  // 장바구니 담기 함수
  const handleAddToCart = () => {
    api.post('/api/cart', {
      itemId: item.id,
      quantity: quantity
    })
      .then(() => alert('장바구니에 담겼습니다.'))
      .catch(err => console.error('장바구니 담기 실패:', err));
  };

  // 구매하기 함수
  const handleBuyNow = () => {
    router.push(`/order?itemId=${item.id}&quantity=${quantity}`);
  };

  if (!item) return <div>로딩중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{item.name}</h1>

      {/* 레이아웃 박스: 좌우 배치 */}
      <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start', justifyContent: 'center' }}>

        {/* 왼쪽: 이미지 */}
        <img
          src={item.images && item.images.length > 0 ? `http://localhost:8080${item.images[0].url}` : '/images/no-image.png'}
          alt={item.name}
          style={{ width: '400px', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
        />

        {/* 오른쪽: 상품 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '10px' }}>
          <p>{item.description}</p>
          <p>가격: {item.price.toLocaleString()}원</p>

          <div>
            <label>수량: </label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '60px' }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button onClick={handleBuyNow} style={{ marginRight: '10px' }}>구매하기</button>
            <button onClick={handleAddToCart}>장바구니 담기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
