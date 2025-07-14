import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const ItemReviews = ({ itemId }) => {
  const [reviews, setReviews] = useState([]);
  const SERVER_URL = 'http://localhost:8080';

  console.log('itemId: ', itemId);

  // ✅ 이미지 URL 처리 함수
  const getImageUrl = (url) =>
    url ? `${SERVER_URL}${url}` : '/default.png';

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/reviews/item/${itemId}`)
      .then((res) => {
        console.log('📦 상품 리뷰 데이터:', res.data);
        setReviews(res.data);
        console.log('리뷰 데이터 확인: ', res.data);
      })
      .catch((err) => console.error('❌ 상품 리뷰 불러오기 실패', err));
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
      hour12: true,
    });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>상품 후기</h3>
      <p style={{fontSize: '12px', color: '#777'}}>리뷰 내용에 상품과 관련 없는 부적절한 표현이 포함될 경우, 별도의 안내 없이 삭제될 수 있음을 양해 부탁드립니다.</p>

      {reviews.length === 0 ? (
        <p style={styles.noReviews}>등록된 리뷰가 없습니다.</p>
      ) : (
        <div style={styles.reviewList}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              {/* 리뷰 이미지 */}
              <div style={styles.imageContainer}>
                {review.images?.[0] ? (
                  <img
                    src={getImageUrl(review.images[0])}
                    alt={review.productName ?? '리뷰 이미지'}
                    style={styles.image}
                    onError={(e) => {
                      if (!e.target.src.includes('default.png')) {
                        e.target.src = '/default.png';
                      }
                    }}
                  />
                ) : (
                  <div style={styles.noImageBox}>이미지 없음</div>
                )}
              </div>

              {/* 리뷰 내용 */}
              <div style={styles.reviewContent}>
                <div style={styles.meta}>
                  <StarRating rating={review.rating} readOnly={true} />
                  <span style={styles.metaText}>
                    {review.authorName} · {formatDate(review.createdAt)}
                  </span>
                </div>
                <p style={styles.reviewText}>{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
  },
  title: {
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  noReviews: {
    color: '#777',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  reviewCard: {
    display: 'flex',
    gap: '16px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '16px',
  },
  imageContainer: {
    minWidth: '100px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  noImageBox: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '14px',
  },
  reviewContent: {
    flexGrow: 1,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metaText: {
    fontSize: '14px',
    color: '#555',
  },
  reviewText: {
    marginTop: '8px',
    lineHeight: '1.5',
    color: '#333',
  },
};

export default ItemReviews;
