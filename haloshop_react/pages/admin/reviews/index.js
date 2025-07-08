import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import StarRating from '../../../components/StarRating';
import AdminLayout from '../AdminLayout';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const SERVER_URL = 'http://localhost:8080';

  // ✅ 리뷰 목록 불러오기
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    axios
      .get(`${SERVER_URL}/api/admin/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('리뷰 목록 불러오기 실패', err));
  };

  // ✅ 리뷰 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      axios
        .delete(`${SERVER_URL}/api/admin/reviews/${id}`)
        .then(() => {
          alert(`리뷰(ID=${id})가 삭제되었습니다.`);
          fetchReviews(); // 삭제 후 목록 갱신
        })
        .catch((err) => {
          console.error('리뷰 삭제 실패', err);
          alert('리뷰 삭제 실패!');
        });
    }
  };

  return (
    <AdminLayout>
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px',
        fontFamily: 'Noto Sans KR, sans-serif',
      }}
    >
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '24px' }}>
        리뷰 관리
      </h2>

      {reviews.length === 0 ? (
        <p style={{ color: '#777', textAlign: 'center' }}>리뷰 내역이 없습니다.</p>
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
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                alignItems: 'center',
              }}
            >
              {/* 이미지 */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#aaa',
                  fontSize: '0.9rem',
                }}
              >
                {review.images && review.images.length > 0 ? (
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

              {/* 내용 */}
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: '600', color: '#333', marginBottom: '6px' }}>
                  [{review.productName}]
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>별점</span>
                  <StarRating rating={review.rating} readOnly={true} />
                </div>
                <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {review.content}
                </p>
              </div>

              {/* ✅ 삭제 버튼 */}
              <div style={{ display: 'flex' }}>
                <button
                  onClick={() => handleDelete(review.id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    border: '1px solid #e74c3c',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminReviewsPage;
