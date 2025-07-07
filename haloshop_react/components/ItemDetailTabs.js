import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemReviews from './ItemReviews';

const ItemDetailTabs = ({ item }) => {
  const [activeTab, setActiveTab] = useState('detail');
  const [imageAlt, setImageAlt] = useState(''); // 🔥 alt 상태 추가

  // 🔥 AI alt 자동 호출
  useEffect(() => {
    if ((item.id === 2 || item.id === 6) && imageAlt.trim() === '') { // 🔥 id 6 추가
      const fetchAlt = async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/ai-image-alt`, {
            params: {
              filename: item.id === 2 ? 'LG_uniform_detail.jpg' : 'KiaTowerDetail.jpg',
              name: item.name || (item.id === 2 ? 'LG 유니폼' : 'KIA 타워'),
              team: item.team || (item.id === 2 ? 'LG 트윈스' : 'KIA 타이거즈')
            }
          });
          setImageAlt(res.data);
        } catch (error) {
          console.error('AI alt 생성 실패:', error);
          setImageAlt(item.id === 2 ? 'LG 유니폼 상세 이미지' : 'KIA 타워 상세 이미지'); // 실패 시 기본 alt
        }
      };

      fetchAlt();
    }
  }, [item, imageAlt]);

  return (
    <div style={{ marginTop: '80px' }}>
      {/* 탭 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('detail')}
          style={{
            padding: '12px 20px',
            borderBottom: activeTab === 'detail' ? '4px solid #c8102e' : 'none',
            fontWeight: activeTab === 'detail' ? 'bold' : 'normal',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: '18px'
          }}
        >
          상품 상세
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          style={{
            padding: '12px 20px',
            borderBottom: activeTab === 'delivery' ? '4px solid #c8102e' : 'none',
            fontWeight: activeTab === 'delivery' ? 'bold' : 'normal',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: '18px'
          }}
        >
          배송 안내
        </button>

        <button
          onClick={() => setActiveTab('review')}
          style={{
            padding: '12px 20px',
            borderBottom: activeTab === 'review' ? '4px solid #c8102e' : 'none',
            fontWeight: activeTab === 'review' ? 'bold' : 'normal',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: '18px'
          }}
        >
          리뷰
        </button>
      </div>

      {/* 탭 내용 */}
      <div style={{ padding: '40px', minHeight: '200px' }}>
        {activeTab === 'detail' && (
          <div>
            {/* 상품 id별로 다른 이미지 출력 */}
            {item.id === 2 && (
              <img
                src="/images/LG_uniform_detail.jpg"
                alt={imageAlt}
                style={{ width: '100%', marginBottom: '20px' }}
              />
            )}

            {item.id === 6 && (
              <img
                src="/images/KiaTowerDetail.jpg"
                alt={imageAlt}
                style={{ width: '100%', marginBottom: '20px' }}
              />
            )}

            {/* 필요하면 계속 추가 가능 */}
            {!([1, 2, 3, 6].includes(item.id)) && (
              <p>상세 이미지 준비 중입니다.</p>
            )}
          </div>
        )}

        {activeTab === 'delivery' && (
          <div>
            <h3>배송/교환/환불 안내</h3>
            <ul>
              <li>배송 방법 : 택배</li>
              <li>배송 지역 : 전국지역</li>
              <li>배송 비용 : 3,000원</li>
              <li>배송 기간 : 3일 ~ 7일</li>
              <li>배송 안내 : - 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는 경우가 있습니다.</li>
              <li>고객님께서 주문하신 상품은 입금 확인 후 배송해 드립니다.</li>
              <li>상품 종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.</li>
            </ul>
          </div>
        )}

        {activeTab === 'review' && (
          <div>
            <ItemReviews itemId={item.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailTabs;
