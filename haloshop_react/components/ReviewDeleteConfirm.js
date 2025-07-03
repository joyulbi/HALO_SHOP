import React from 'react';
import axios from 'axios';

const ReviewDeleteConfirm = ({ reviewId, onClose, onSuccess }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
      alert('리뷰 삭제 성공');
      onSuccess(); // 목록 갱신 등
    } catch (err) {
      alert('리뷰 삭제 실패');
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '8px', color: 'red' }}>
      <p>정말 삭제하시겠습니까?</p>
      <button onClick={handleDelete}>삭제</button>
      <button onClick={onClose} style={{ marginLeft: '6px' }}>
        취소
      </button>
    </div>
  );
};

export default ReviewDeleteConfirm;