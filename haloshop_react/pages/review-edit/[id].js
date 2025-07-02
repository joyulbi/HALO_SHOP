import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import StarRating from '../../components/StarRating';

const ReviewEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [review, setReview] = useState(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const SERVER_URL = 'http://localhost:8080';

  useEffect(() => {
    if (!id) return;
    axios.get(`${SERVER_URL}/api/reviews/${id}`)
      .then(res => {
        setReview(res.data);
        setContent(res.data.content);
        setRating(res.data.rating);
      })
      .catch(err => {
        console.error('리뷰 불러오기 실패', err);
        alert('리뷰를 불러올 수 없습니다.');
        router.back();
      });
  }, [id]);

  const handleSubmit = async () => {
    try {
      await axios.put(`${SERVER_URL}/api/reviews/${id}`, { content, rating });
      alert('리뷰 수정 완료');
      router.push('/my-reviews');
    } catch (err) {
      alert('수정 실패');
      console.error(err);
    }
  };

  if (!review) return <p>로딩 중...</p>;

  return (
    <div style={{ display: 'flex', padding: '32px', gap: '32px' }}>
      {/* 왼쪽: 이미지 & 상품정보 */}
      <div style={{ flex: '1' }}>
        <p style={{ fontWeight: 'bold' }}>내가 구매한 상품</p>
        <p style={{ margin: '12px 0' }}>{review.productName || '[상품명 없음]'}</p>

        {/* 메인 이미지 (첫 이미지) */}
        {review.images?.length > 0 && (
          <img
            src={`${SERVER_URL}${review.images[0]}`}
            alt="메인 이미지"
            style={{ width: '100%', maxWidth: '300px', marginBottom: '8px' }}
          />
        )}

        {/* 썸네일들 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {review.images?.slice(1).map((url, idx) => (
            <img
              key={idx}
              src={`${SERVER_URL}${url}`}
              alt={`리뷰 이미지 ${idx}`}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
            />
          ))}
        </div>
      </div>

      {/* 오른쪽: 리뷰 수정 폼 */}
      <div style={{ flex: '1' }}>
        <h2 style={{ marginBottom: '16px' }}>리뷰 수정</h2>

        <div style={{ marginBottom: '12px' }}>
          <label><strong>⭐ 별점:</strong></label><br />
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label><strong>리뷰 내용:</strong></label><br />
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button onClick={handleSubmit} style={{ marginRight: '8px' }}>저장</button>
        <button onClick={() => router.back()}>취소</button>
      </div>
    </div>
  );
};

export default ReviewEditPage;
