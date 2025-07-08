import React, { useState } from 'react';
import axios from '../utils/axios';

const ReviewImageUpload = ({ reviewId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const SERVER_URL = 'http://localhost:8080';

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file || !reviewId) {
      alert('리뷰가 등록된 후에 이미지를 업로드할 수 있습니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(
        `${SERVER_URL}/api/reviews/images/${reviewId}/upload`,
        formData
      );

      const imageUrl = `${SERVER_URL}${res.data.url}`;
      setUploadedUrl(imageUrl);
      alert('이미지 업로드 성공');

      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지 업로드 실패: ' + err.message);
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <label><strong>이미지 선택:</strong></label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '12px' }}>이미지 업로드</button>

      {previewUrl && (
        <div style={{ marginTop: '10px' }}>
          <p>미리보기:</p>
          <img src={previewUrl} alt="미리보기" width={200} />
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginTop: '10px', color: '#1a8917' }}>
          ✅ 서버 업로드 완료: <code>{uploadedUrl}</code>
        </div>
      )}
    </div>
  );
};

export default ReviewImageUpload;