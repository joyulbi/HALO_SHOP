import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from '../../components/StarRating';

const ReviewDeletePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [review, setReview] = useState(null);
  const SERVER_URL = 'http://localhost:8080';

  useEffect(() => {
    if (!id) return;
    axios.get(`${SERVER_URL}/api/reviews/${id}`)
      .then((res) => setReview(res.data))
      .catch((err) => {
        console.error(err);
        alert('리뷰 불러오기 실패');
        router.back();
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}/api/reviews/${id}`);
      alert('리뷰 삭제 완료');
      router.push('/my-reviews');
    } catch (err) {
      console.error(err);
      alert('리뷰 삭제 실패');
    }
  };

  if (!review) return <p>로딩 중...</p>;

  return (
    <div style={{ display: 'flex', padding: '32px', gap: '32px' }}>
      {/* 왼쪽: 이미지 & 상품정보 */}
      <div style={{ flex: '1' }}>
        <p style={{ fontWeight: 'bold' }}>내가 구매한 상품</p>
        <p style={{ margin: '12px 0' }}>{review.productName || '[상품명 없음]'}</p>

        {/* 메인 이미지 */}
        {review.images?.length > 0 && (
          <img
            src={`${SERVER_URL}${review.images[0]}`}
            alt="리뷰 이미지"
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

      {/* 오른쪽: 삭제 확인 */}
      <div style={{ flex: '1' }}>
        <h2 style={{ marginBottom: '16px' }}>리뷰 삭제</h2>

        <div style={{ marginBottom: '12px' }}>
          <strong>⭐ 별점:</strong><br />
          <StarRating rating={review.rating} readOnly={true} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <strong>리뷰 내용:</strong>
          <div style={{ border: '1px solid #ccc', padding: '8px', marginTop: '4px' }}>
            {review.content}
          </div>
        </div>

        <p style={{ color: 'red', marginBottom: '16px' }}>
          정말 이 리뷰를 삭제하시겠습니까?
        </p>

        <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px' }}>
          삭제
        </button>
        <button onClick={() => router.back()} style={{ marginLeft: '12px' }}>
          취소
        </button>
      </div>
    </div>
  );
};

export default ReviewDeletePage;
