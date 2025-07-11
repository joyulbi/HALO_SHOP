import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import Link from 'next/link';

const RecommendedSidebar = () => {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(true); // 🔥 표시 여부

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setVisible(false); // 로그인 안 돼 있으면 숨김
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/api/recommend/gpt');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data);
          setVisible(true);
        } else {
          setVisible(false); // 추천 없음
        }
      } catch (error) {
        console.error('추천 불러오기 실패: ', error);
        setVisible(false); // 에러 시 숨김
      }
    };

    fetchRecommendations();
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '30px',
      width: '260px',
      background: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '16px',
      zIndex: 1000,
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>추천 상품</h3>
      {items.map(item => (
        <Link key={item.id} href={`/items/${item.id}`} passHref>
          <div style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
          }}>
            <img
              src={item.images?.[0]?.url ? `http://localhost:8080${item.images[0].url}` : '/images/no-image.png'}
              alt={item.name}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '6px' }}
            />
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</div>
            <div style={{ fontSize: '13px', color: '#c8102e' }}>{item.price.toLocaleString()}원</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecommendedSidebar;
