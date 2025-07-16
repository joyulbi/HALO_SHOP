import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import Link from 'next/link';

const RecommendedSidebar = () => {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(true); // 🔥 표시 여부

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setVisible(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/api/recommend/gpt', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('🔥 추천 응답:', res.data);
        setItems(res.data);
        setVisible(Array.isArray(res.data) && res.data.length > 0);
      } catch (error) {
        console.error('추천 불러오기 실패:', error);
        setVisible(false);
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
      {/* 상단 제목 + 닫기 버튼 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>추천 상품</h3>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#999',
          }}
          aria-label="닫기"
        >
          ❌
        </button>
      </div>

      {items.map(item => {
        const rawUrl = item.images && item.images.length > 0 ? item.images[0].url : null;
        const imageUrl = rawUrl
          ? (rawUrl.startsWith('/images')
              ? `http://localhost:8080${rawUrl}`
              : `http://localhost:8080/images/${rawUrl}`)
          : null;

        return (
          <Link key={item.id} href={`/items/${item.id}`} passHref>
            <div style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '10px',
              cursor: 'pointer'
            }}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.name}
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '6px' }}
                />
              )}
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ fontSize: '13px', color: '#c8102e' }}>{item.price.toLocaleString()}원</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RecommendedSidebar;
