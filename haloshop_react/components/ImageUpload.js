import React, { useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageUpload = ({ isMultiUpload, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (isMultiUpload) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    } else {
      setSelectedFiles(files);
      setPreviewUrls(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('파일을 선택하세요.');
      return;
    }

    setUploading(true);

    try {
      // 🔥 병렬 업로드
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post('http://localhost:8080/api/admin/item-images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('서버 응답:', res.data);
        return res.data; // 서버에서 받은 상대 경로 붙이기
      });

      // 🔥 모든 업로드가 끝날 때까지 기다림
      const uploadedUrls = await Promise.all(uploadPromises);

      alert('이미지 업로드 성공!');
      console.log('업로드된 이미지 URL:', uploadedUrls);

      if (onUploadSuccess) {
        onUploadSuccess(uploadedUrls);
      }

    } catch (error) {
      console.error(error);
      alert('이미지 업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple={isMultiUpload}
        onChange={handleFileChange}
      />

      {previewUrls.length > 0 && isMultiUpload && (
        <Slider {...sliderSettings}>
          {previewUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt="" className="w-80 h-80 object-cover mx-auto" />
            </div>
          ))}
        </Slider>
      )}

      {previewUrls.length > 0 && !isMultiUpload && (
        <div>
          <img src={previewUrls[0]} alt="" className="w-80 h-80 object-cover mx-auto" />
        </div>
      )}

      <button
        onClick={handleUpload}
        className={`px-4 py-2 rounded ${uploading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
        disabled={uploading}
      >
        {uploading ? '업로드 중...' : '이미지 업로드'}
      </button>
    </div>
  );
};

export default ImageUpload;
