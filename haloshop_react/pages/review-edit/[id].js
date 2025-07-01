// pages/review-edit/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const SERVER_URL = 'http://localhost:8080';

  const [review, setReview] = useState(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (id) {
      axios.get(`${SERVER_URL}/api/reviews/${id}`)
        .then(res => {
          setReview(res.data);
          setContent(res.data.content);
          setRating(res.data.rating);
        })
        .catch(err => console.error('리뷰 조회 실패', err));
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      await axios.put(`${SERVER_URL}/api/reviews/${id}`, { content, rating });
      alert('리뷰 수정 완료');
      window.close(); // 창 닫기
    } catch (err) {
      alert('리뷰 수정 실패');
    }
  };

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${SERVER_URL}/api/reviews/${id}`);
        alert('리뷰가 삭제되었습니다');
        window.close(); // 창 닫기
      } catch (err) {
        alert('삭제 실패');
      }
    }
  };

  if (!review) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h2>리뷰 수정</h2>

      <div style={{ marginBottom: '12px' }}>
        <label>별점:</label><br />
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>리뷰 내용:</label><br />
        <textarea
          rows={5}
          style={{ width: '100%' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>리뷰 수정</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>삭제</button>
    </div>
  );
};

export default ReviewEditPage;
