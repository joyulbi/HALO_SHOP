import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

  if (authLoading) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>내가 쓴 리뷰</h2>

      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {reviews.map((review) => {
            console.log("이미지 경로: ", review.images?.[0]);  // ✅ 이미지 경로 로그 확인용

            return (
              <div
                key={review.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  position: 'relative',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '16px',
                }}
              >
                {/* 이미지 */}
                <div>
                  {review.images?.length > 0 ? (
                    <img
                      src={`${SERVER_URL}${review.images[0]}`}
                      alt="리뷰 이미지"
                      style={{ width: '140px', borderRadius: '8px' }}
                    />
                  ) : (
                    <span style={{ color: '#999' }}>이미지 없음</span>
                  )}
                </div>

                {/* 리뷰 내용 */}
                <div style={{ flexGrow: 1 }}>
                  <p>
                    <strong>[{review.productName || '상품명 없음'}]</strong>
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>별점</span>
                    <StarRating rating={review.rating} readOnly={true} />
                  </div>
                  <p style={{ marginTop: '8px' }}>{review.content}</p>
                </div>

                {/* ⋯ 버튼 */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleClickMenu(review.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    ⋯
                  </button>

                  {/* 메뉴 */}
                  {activeMenuId === review.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '28px',
                        right: '0px',
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.15)',
                        zIndex: 100,
                        fontSize: '13px',
                        minWidth: '80px',
                        padding: '4px 0',
                      }}
                    >
                      <div
                        onClick={() => router.push(`/review-edit/${review.id}`)}
                        style={{ padding: '4px 8px', cursor: 'pointer' }}
                      >
                        리뷰 수정
                      </div>
                      <div
                        onClick={() => router.push(`/review-delete/${review.id}`)}
                        style={{ padding: '4px 8px', cursor: 'pointer' }}
                      >
                        리뷰 삭제
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;