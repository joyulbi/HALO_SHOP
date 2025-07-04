import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const ItemReviews = ({ itemId }) => {
  const [reviews, setReviews] = useState([]);
  const SERVER_URL = 'http://localhost:8080';

  console.log("itemId: ", itemId);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/reviews/item/${itemId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('상품 리뷰 불러오기 실패', err));
  }, [itemId]);

  // ✅ 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>상품 후기</h3>

      {reviews.length === 0 ? (
        <p style={{ color: '#777' }}>등록된 리뷰가 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                display: 'flex',
                gap: '16px',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '16px',
              }}
            >
              {/* 리뷰 이미지 */}
              <div style={{ minWidth: '100px' }}>
                {review.images?.length > 0 ? (
                  <img
                    src={`${SERVER_URL}${review.images[0]}`}
                    alt="리뷰 이미지"
                    style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#aaa',
                      fontSize: '14px',
                    }}
                  >
                    이미지 없음
                  </div>
                )}
              </div>

              {/* 리뷰 내용 */}
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarRating rating={review.rating} readOnly={true} />
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    {review.authorName} · {formatDate(review.createdAt)}
                  </span>
                </div>
                <p style={{ marginTop: '8px', lineHeight: '1.5', color: '#333' }}>{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemReviews;
