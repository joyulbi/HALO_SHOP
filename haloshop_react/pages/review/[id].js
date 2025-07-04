import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import StarRating from '../../components/StarRating';

const ReviewPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [review, setReview] = useState({
    content: '',
    rating: 0,
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    setReview({ ...review, rating: newRating });
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      const reviewDto = {
        orderItemsId: id,
        content: review.content,
        rating: review.rating,
        accountId: 1
      };

      // ✅ JSON을 Blob으로 처리
      formData.append("reviewDto", new Blob([JSON.stringify(reviewDto)], { type: "application/json" }));
      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("http://localhost:8080/api/reviews", formData);

      alert('리뷰 작성 완료');
      router.push('/delivery');
    } catch (err) {
      if (err.response?.status === 409) {
        alert('이미 리뷰를 작성하셨습니다.');
      } else {
        alert('리뷰 작성 실패');
        console.error(err);
      }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>리뷰 작성</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '12px' }}>
          <label style={{ marginRight: '8px' }}>별점:</label>
          <StarRating rating={review.rating} setRating={handleRatingChange} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>리뷰 내용:</label><br />
          <textarea
            name="content"
            rows={4}
            cols={40}
            value={review.content}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>이미지 첨부:</label><br />
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
        </div>

        <button type="submit">리뷰 등록</button>
      </form>
    </div>
  );
};

export default ReviewPage;