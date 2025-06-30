import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ isMultiUpload, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (isMultiUpload) {
      // 다중 모드: 기존 파일 유지 + 추가
      setSelectedFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    } else {
      // 단일 모드: 마지막 선택 파일 1개만 유지
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
      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post('http://localhost:8080/api/admin/item-images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedUrls.push(res.data);
      }

      alert('이미지 업로드 성공!');
      console.log('업로드된 이미지 URL:', uploadedUrls);

      if (onUploadSuccess) {
        if (isMultiUpload) {
          onUploadSuccess(uploadedUrls); // 다중
        } else {
          onUploadSuccess([uploadedUrls[0]]); // 단일
        }
      }

      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error(error);
      alert('이미지 업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple={isMultiUpload}
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap gap-4">
        {previewUrls.map((url, index) => (
          <img key={index} src={url} alt={`미리보기-${index}`} className="w-32 h-32 object-cover" />
        ))}
      </div>

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
