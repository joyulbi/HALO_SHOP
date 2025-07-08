import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    axios.get(`${SERVER_URL}/api/admin/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('리뷰 목록 불러오기 실패', err));
  };

  // ✅ 리뷰 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      axios.delete(`${SERVER_URL}/api/admin/reviews/${id}`)
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
    <div style={{ padding: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>리뷰 관리</h2>

      {reviews.length === 0 ? (
        <p>리뷰 내역이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                display: 'flex',
                gap: '16px',
                borderBottom: '1px solid #eee',
                paddingBottom: '16px'
              }}
            >
              {/* 이미지 */}
              <div>
                {review.imageUrl ? (
                  <img
                    src={`${SERVER_URL}${review.imageUrl}`}
                    alt="상품 이미지"
                    style={{ width: '100px', borderRadius: '6px' }}
                  />
                ) : (
                  <span style={{ color: '#999' }}>이미지 없음</span>
                )}
              </div>

              {/* 내용 */}
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: 'bold' }}>[{review.productName}]</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>별점</span>
                  <StarRating rating={review.rating} readOnly={true} />
                </div>
                <p style={{ marginTop: '8px' }}>{review.content}</p>
              </div>

              {/* ✅ 삭제 버튼 */}
              <div>
                <button
                  onClick={() => handleDelete(review.id)}
                  style={{
                    border: '1px solid #e74c3c',
                    background: '#e74c3c',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
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
