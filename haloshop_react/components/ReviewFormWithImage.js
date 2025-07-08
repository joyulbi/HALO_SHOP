import axios from "../utils/axios";
import { useState } from "react";

export default function ReviewFormWithImage({ orderItemsId, accountId }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);

  const SERVER_URL = 'http://localhost:8080';

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleReviewSubmit = async () => {
    try {
      const formData = new FormData();
      const reviewDto = {
        orderItemsId,
        accountId,
        content,
        rating
      };

      // ✅ JSON을 Blob 처리
      formData.append("reviewDto", new Blob([JSON.stringify(reviewDto)], { type: "application/json" }));
      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post(`${SERVER_URL}/api/reviews`, formData);

      alert("리뷰 및 이미지 등록 성공");
      setContent("");
      setImages([]);
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      alert("리뷰 등록 실패: " + err.message);
    }
  };

  return (
    <div>
      <h3>리뷰 작성</h3>
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="리뷰 내용을 입력하세요"
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />
      <div style={{ marginBottom: "12px" }}>
        <label>별점:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((v) => (
            <option key={v} value={v}>{v}점</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label>이미지 첨부:</label>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      </div>
      <button onClick={handleReviewSubmit} style={{ marginTop: "8px" }}>
        리뷰 등록
      </button>
    </div>
  );
}

