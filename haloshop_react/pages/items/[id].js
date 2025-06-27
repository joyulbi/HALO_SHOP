import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/axios';

const ItemDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);

  useEffect(() => {
    if (id) { // id가 넘어오면 호출
      api.get(`/api/items/${id}`)
        .then(res => setItem(res.data))
        .catch(err => console.error('상품 상세 불러오기 실패:', err));
    }
  }, [id]);

  if (!item) return <div>로딩중...</div>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>가격: {item.price.toLocaleString()}원</p>
    </div>
  );
};

export default ItemDetail;
