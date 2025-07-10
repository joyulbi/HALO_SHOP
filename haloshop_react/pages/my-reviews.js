import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import StarRating from '../components/StarRating';
import { useAuth } from '../hooks/useAuth';

const MyReviewsPage = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const router = useRouter();

  const SERVER_URL = 'http://localhost:8080';

  const getImageUrl = (url) =>
    url ? `${SERVER_URL}${url}` : '/default.png';

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`${SERVER_URL}/api/reviews/user/${user.id}`)
        .then((res) => {
          console.log('📦 받은 리뷰 데이터:', res.data);
          setReviews(res.data);
        })
        .catch((err) => console.error('❌ 리뷰 불러오기 실패', err));
    }
  }, [user]);

  const handleClickMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  if (authLoading) {
    return <p style={styles.loading}>로딩 중...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>내가 쓴 리뷰</h2>

      {reviews.length === 0 ? (
        <p style={styles.noReviews}>작성한 리뷰가 없습니다.</p>
      ) : (
        <div style={styles.reviewList}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={styles.reviewCard}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(0, 0, 0, 0.1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.05)')
              }
            >
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
                  <span>이미지 없음</span>
                )}
              </div>
              <div style={styles.reviewContent}>
                <p style={styles.productName}>
                  [{review.productName ?? '상품명 없음'}]
                </p>
                <div style={styles.ratingRow}>
                  <span style={styles.ratingLabel}>별점</span>
                  <StarRating rating={review.rating} readOnly={true} />
                </div>
                <p style={styles.reviewText}>{review.content}</p>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => handleClickMenu(review.id)}
                  style={styles.menuButton}
                >
                  ⋯
                </button>
                {activeMenuId === review.id && (
                  <div style={styles.menu}>
                    <div
                      onClick={() => router.push(`/review-edit/${review.id}`)}
                      style={styles.menuItem}
                    >
                      리뷰 수정
                    </div>
                    <div
                      onClick={() => router.push(`/review-delete/${review.id}`)}
                      style={styles.menuItem}
                    >
                      리뷰 삭제
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px' },
  title: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '24px' },
  noReviews: { color: '#777', textAlign: 'center' },
  loading: { textAlign: 'center', color: '#777' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  reviewCard: {
    display: 'flex',
    gap: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    transition: 'box-shadow 0.2s ease',
  },
  imageContainer: {
    width: '140px',
    height: '140px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '0.9rem',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  reviewContent: { flexGrow: 1 },
  productName: { fontWeight: '600', color: '#333' },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
  },
  ratingLabel: { fontSize: '0.9rem', color: '#555' },
  reviewText: {
    marginTop: '8px',
    color: '#444',
    lineHeight: '1.5',
    fontSize: '0.95rem',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#777',
    cursor: 'pointer',
  },
  menu: {
    position: 'absolute',
    top: '30px',
    right: '0',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
    minWidth: '120px',
  },
  menuItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#333',
  },
};

export default MyReviewsPage;
