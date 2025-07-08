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
        .then((res) => setReviews(res.data))
        .catch((err) => console.error('리뷰 불러오기 실패', err));
    }
  }, [user]);

  const handleClickMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  if (authLoading) {
    return <p style={{ textAlign: 'center', color: '#777' }}>로딩 중...</p>;
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: 'Noto Sans KR, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '24px',
        }}
      >
        내가 쓴 리뷰
      </h2>

      {reviews.length === 0 ? (
        <p style={{ color: '#777', textAlign: 'center' }}>
          작성한 리뷰가 없습니다.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                display: 'flex',
                gap: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                transition: 'box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(0, 0, 0, 0.1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.05)')
              }
            >
              {/* 이미지 */}
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#aaa',
                  fontSize: '0.9rem',
                }}
              >
                {review.images?.length > 0 ? (
                  <img
                    src={`${SERVER_URL}${review.images[0]}`}
                    alt="리뷰 이미지"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <span>이미지 없음</span>
                )}
              </div>

              {/* 리뷰 내용 */}
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: '600', color: '#333' }}>
                  [{review.productName || '상품명 없음'}]
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>별점</span>
                  <StarRating rating={review.rating} readOnly={true} />
                </div>
                <p
                  style={{
                    marginTop: '8px',
                    color: '#444',
                    lineHeight: '1.5',
                    fontSize: '0.95rem',
                  }}
                >
                  {review.content}
                </p>
              </div>

              {/* ⋯ 버튼 */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => handleClickMenu(review.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#777',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#333')}
                  onMouseLeave={(e) => (e.target.style.color = '#777')}
                >
                  ⋯
                </button>

                {/* 메뉴 */}
                {activeMenuId === review.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '30px',
                      right: '0',
                      background: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 10,
                      minWidth: '120px',
                    }}
                  >
                    <div
                      onClick={() => router.push(`/review-edit/${review.id}`)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f5f5f5')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      리뷰 수정
                    </div>
                    <div
                      onClick={() => router.push(`/review-delete/${review.id}`)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f5f5f5')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
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

export default MyReviewsPage;
