import React, { useState } from 'react';
import axios from 'axios';

const ReviewEditForm = ({ review, onClose, onSuccess }) => {
  const [content, setContent] = useState(review.content);
  const [rating, setRating] = useState(review.rating);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/reviews/${review.id}`, {
        content,
        rating,
      });
      alert('리뷰 수정 성공');
      onSuccess(); // 목록 갱신 등
    } catch (err) {
      alert('리뷰 수정 실패');
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: '100%' }}
      />
      <div style={{ marginTop: '6px' }}>
        <label>⭐ 별점: </label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>
      <div style={{ marginTop: '8px' }}>
        <button onClick={handleUpdate}>저장</button>
        <button onClick={onClose} style={{ marginLeft: '6px' }}>
          취소
        </button>
      </div>
    </div>
  );
};

export default ReviewEditForm;