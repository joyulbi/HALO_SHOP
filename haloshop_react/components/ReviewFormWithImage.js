// components/ReviewFormWithImage.js
import axios from "axios";
import { useState } from "react";

export default function ReviewFormWithImage({ orderItemsId, accountId }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleReviewSubmit = async () => {
    try {
      // 1. 리뷰 먼저 등록
      const reviewRes = await axios.post("http://localhost:8080/api/reviews", {
        orderItemsId,
        accountId,
        content,
        rating,
      });

      const reviewId = reviewRes.data.reviewId || reviewRes.data.id; // 응답에 따라 확인

      if (file && reviewId) {
        // 2. 이미지가 있으면 업로드
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(
          `http://localhost:8080/api/reviews/images/${reviewId}/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setUploadedImageUrl(`http://localhost:8080${uploadRes.data.url}`);
        alert("리뷰 및 이미지 등록 성공");
      } else {
        alert("리뷰 등록 성공 (이미지 없음)");
      }

      setContent("");
      setFile(null);
    } catch (err) {
      console.error("등록 실패", err);
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
        style={{ width: "100%", padding: "8px" }}
      />
      <div>
        <label>별점:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((v) => (
            <option key={v} value={v}>{v}점</option>
          ))}
        </select>
      </div>
      <div>
        <label>이미지 첨부:</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button onClick={handleReviewSubmit}>등록</button>

      {uploadedImageUrl && (
        <div style={{ marginTop: "10px" }}>
          <p>업로드된 이미지:</p>
          <img src={uploadedImageUrl} alt="리뷰 이미지" width={200} />
        </div>
      )}
    </div>
  );
}
