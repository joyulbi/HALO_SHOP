import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);

  const accountId = 1;
  const SERVER_URL = 'http://localhost:8080';

  useEffect(() => {
    axios.get(`${SERVER_URL}/api/reviews/user/${accountId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('리뷰 불러오기 실패', err));
  }, []);

  const handleEditClick = (review) => {
    setEditingId(review.id);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent('');
    setEditRating(5);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${SERVER_URL}/api/reviews/${id}`, {
        content: editContent,
        rating: editRating,
      });
      alert('리뷰 수정 성공');
      location.reload();
    } catch (err) {
      alert('리뷰 수정 실패');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${SERVER_URL}/api/reviews/${id}`);
      alert('리뷰 삭제 성공');
      location.reload();
    } catch (err) {
      alert('리뷰 삭제 실패');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>내가 쓴 리뷰</h2>

      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th>이미지</th>
              <th>내용</th>
              <th>⭐ 별점</th>
              <th>작성일</th>
              <th>수정/삭제</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>
                  {review.images?.length > 0 ? (
                    review.images.map((url, idx) => (
                      <img
                        key={idx}
                        src={`${SERVER_URL}${url}`}
                        alt={`리뷰 이미지 ${idx}`}
                        style={{ width: '80px', borderRadius: '4px', marginRight: '4px' }}
                      />
                    ))
                  ) : (
                    <span style={{ color: '#999' }}>이미지 없음</span>
                  )}
                </td>

                <td>
                  {editingId === review.id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ width: '100%', height: '60px' }}
                    />
                  ) : (
                    review.content
                  )}
                </td>

                <td>
                  {editingId === review.id ? (
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                      style={{ width: '50px' }}
                    />
                  ) : (
                    `${review.rating}점`
                  )}
                </td>

                <td>{new Date(review.createdAt).toLocaleString()}</td>

                <td>
                  {editingId === review.id ? (
                    <>
                      <button onClick={() => handleUpdate(review.id)}>저장</button>
                      <button onClick={handleCancel} style={{ marginLeft: '6px' }}>취소</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(review)}>수정</button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        style={{ marginLeft: '6px', color: 'red' }}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyReviewsPage;
