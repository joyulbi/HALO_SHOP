import React, { useState } from 'react';
import axios from 'axios';

export default function ReviewTestPage() {
  const [review, setReview] = useState({
    orderItemsId: 1,
    accountId: 1,
    content: '',
    rating: 5,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. 리뷰 등록
      const res = await axios.post("http://localhost:8080/api/reviews", review);
      alert(res.data);

      // 2. 이미지 업로드
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const imageRes = await axios.post(
          `http://localhost:8080/api/reviews/images/${review.orderItemsId}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("이미지 업로드 성공");
      }
    } catch (err) {
      console.error(err);
      alert("리뷰 작성 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        리뷰 : 
        <textarea
          name="content"
          value={review.content}
          onChange={handleChange}
          placeholder="리뷰 내용을 입력하세요"
        />
      </div>
      <br />
      <div>
        별점 : 
        <input
          type="number"
          name="rating"
          value={review.rating}
          onChange={handleChange}
          min="1"
          max="5"
        />
      </div>
      <br />
      <div>
        이미지 : 
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <button type="submit">리뷰 작성</button>
    </form>
  );
}
