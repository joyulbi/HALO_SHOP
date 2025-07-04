import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderRow = styled.div`
  display: flex;
  font-weight: bold;
  border-bottom: 2px solid #ccc;
  padding: 0.75rem 0;
  background-color: #f5f5f5;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  &:hover {
    background-color: #fafafa;
  }
`;

const Cell = styled.div`
  flex: ${({ flex }) => flex || 1};
  padding: 0 0.5rem;
  word-break: break-word;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
  margin-right: 8px;
`;

const Button = styled.button`
  background-color: ${({ danger }) => (danger ? "#dc3545" : "#007bff")};
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: 0.5rem;

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const TextButton = styled.span`
  color: #007bff;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;


const TextOnlyButton = styled.span`
  color: #007bff;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  margin: 6px 8px 0 0;
  display: inline-block;
  &:hover {
    text-decoration: underline;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6px;
`;

const CampaignSeasonImagesManagement = () => {
  const [seasonImages, setSeasonImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({});
  const [previewData, setPreviewData] = useState({});
  const [fileData, setFileData] = useState({});

  const imgURL = "http://localhost:8080/image/campaign/";
  const defaultImg = "http://localhost:8080/image/";

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/campaign-images")
      .then((res) => setSeasonImages(res.data))
      .catch((err) => console.error(err));
  }, []);

const getImageSrc = (seasonId, levelField, originalLevel) => {
  if (previewData[seasonId]?.[levelField]) {
    return previewData[seasonId][levelField];
  }
  if (editData[seasonId]?.[levelField]) {
    return imgURL + editData[seasonId][levelField] + "?t=" + new Date().getTime();
  }
  if (originalLevel && originalLevel.trim() !== "") {
    return imgURL + originalLevel;
  }

  // 기본 이미지 파일명 레벨별로 다르게 처리
  const defaultLevelImages = {
    level_1: "level1.png",
    level_2: "level2.png",
    level_3: "level3.png",
  };

  return defaultImg + (defaultLevelImages[levelField] || "default.png");
};

  const handleEditClick = (item) => {
    setEditingId(item.seasonId);
    setEditData((prev) => ({
      ...prev,
      [item.seasonId]: {
        level_1: item.level_1 || "",
        level_2: item.level_2 || "",
        level_3: item.level_3 || "",
      },
    }));
    setPreviewData((prev) => ({
      ...prev,
      [item.seasonId]: {
        level_1: "",
        level_2: "",
        level_3: "",
      },
    }));
    setFileData((prev) => ({
      ...prev,
      [item.seasonId]: {
        level_1: null,
        level_2: null,
        level_3: null,
      },
    }));
  };

  const handleCancelClick = () => {
    if (editingId && previewData[editingId]) {
      Object.values(previewData[editingId]).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    }
    setEditData((prev) => {
      const copy = { ...prev };
      if (editingId) delete copy[editingId];
      return copy;
    });
    setPreviewData((prev) => {
      const copy = { ...prev };
      if (editingId) delete copy[editingId];
      return copy;
    });
    setFileData((prev) => {
      const copy = { ...prev };
      if (editingId) delete copy[editingId];
      return copy;
    });
    setEditingId(null);
  };

  const handleFileChange = (seasonId, file, levelField) => {
    if (!file) return;
    if (previewData[seasonId]?.[levelField]?.startsWith("blob:")) {
      URL.revokeObjectURL(previewData[seasonId][levelField]);
    }
    const blobUrl = URL.createObjectURL(file);

    setPreviewData((prev) => ({
      ...prev,
      [seasonId]: {
        ...prev[seasonId],
        [levelField]: blobUrl,
      },
    }));

    setFileData((prev) => ({
      ...prev,
      [seasonId]: {
        ...prev[seasonId],
        [levelField]: file,
      },
    }));

    // 삭제 상태가 있으면 해제 (이미지 교체니까 삭제 취소)
    setEditData((prev) => {
      const copy = { ...prev };
      if (copy[seasonId]) {
        delete copy[seasonId][levelField + "_deleted"];
      }
      return copy;
    });
  };

  // 이미지 삭제 (UI 상에서만 처리, 저장 전까지 실제 DB 영향 없음)
  const handleDeleteImage = (seasonId, levelField) => {
    // 프리뷰 URL 있으면 해제
    if (previewData[seasonId]?.[levelField]?.startsWith("blob:")) {
      URL.revokeObjectURL(previewData[seasonId][levelField]);
    }

    // 삭제 표시 저장
    setEditData((prev) => ({
      ...prev,
      [seasonId]: {
        ...(prev[seasonId] || {}),
        [levelField]: "",              // 이미지 파일명은 빈 문자열로
        [levelField + "_deleted"]: true, // 삭제 표시 플래그
      },
    }));

    // 프리뷰, 파일 데이터 초기화
    setPreviewData((prev) => ({
      ...prev,
      [seasonId]: {
        ...(prev[seasonId] || {}),
        [levelField]: "",
      },
    }));

    setFileData((prev) => ({
      ...prev,
      [seasonId]: {
        ...(prev[seasonId] || {}),
        [levelField]: null,
      },
    }));
  };

  const handleSaveClick = async (seasonId) => {
    setLoading(true);

    try {
      const filesForSeason = fileData[seasonId] || {};
      const uploadedFiles = {};

      for (const levelField of ["level_1", "level_2", "level_3"]) {
        // 만약 삭제 표시가 있으면 업로드 생략하고 빈 문자열로 처리
        if (editData[seasonId]?.[levelField + "_deleted"]) {
          uploadedFiles[levelField] = "";
          continue;
        }

        const file = filesForSeason[levelField];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "level",
            levelField === "level_1" ? 1 : levelField === "level_2" ? 2 : 3
          );

          const res = await axios.post(
            `http://localhost:8080/api/campaign-images/${seasonId}/upload`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          uploadedFiles[levelField] = res.data.filename;
        }
      }

      const newEditData = { ...(editData[seasonId] || {}) };
      for (const key of Object.keys(uploadedFiles)) {
        newEditData[key] = uploadedFiles[key];
      }

      const res = await axios.patch(
        `http://localhost:8080/api/campaign-images/${seasonId}`,
        {
          seasonId,
          ...newEditData,
        }
      );

      if (res.status === 200 || res.status === 204) {
        setSeasonImages((prev) =>
          prev.map((item) =>
            item.seasonId === seasonId ? { ...item, ...newEditData } : item
          )
        );
        alert("저장 성공!");
        handleCancelClick();
      } else {
        alert("저장 실패: 서버 응답 오류");
      }
    } catch (error) {
      console.error(error);
      alert("저장 실패: 예외 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <HeaderRow>
        <Cell flex="0.7">시즌 ID</Cell>
        <Cell flex="3">레벨 1 이미지</Cell>
        <Cell flex="3">레벨 2 이미지</Cell>
        <Cell flex="3">레벨 3 이미지</Cell>
        <Cell flex="2">관리</Cell>
      </HeaderRow>

      {seasonImages.map((item) => {
        const isEditing = editingId === item.seasonId;

        return (
          <Row key={item.seasonId}>
            <Cell flex="0.7">{item.seasonId}</Cell>

{["level_1", "level_2", "level_3"].map((level) => (
  <Cell key={level} flex="3" style={{ flexDirection: "column" }}>
    <PreviewImage
      src={getImageSrc(item.seasonId, level, isEditing ? null : item[level])}
      alt={level}
    />
    {isEditing && (
      <div>
        <TextOnlyButton onClick={() => {
          // 파일 선택 트리거 (input 숨겨져 있어 label 클릭)
          document.getElementById(`file-input-${item.seasonId}-${level}`).click();
        }}>
          수정
        </TextOnlyButton>
        <TextOnlyButton
          onClick={() => handleDeleteImage(item.seasonId, level)}
          style={{ color: "#dc3545" }}
        >
          삭제
        </TextOnlyButton>

        <input
          id={`file-input-${item.seasonId}-${level}`}
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleFileChange(item.seasonId, e.target.files[0], level)
          }
          style={{ display: "none" }}
        />
      </div>
    )}
  </Cell>
))}

            <Cell flex="2" style={{ justifyContent: "center" }}>
              {!isEditing ? (
                <TextButton onClick={() => handleEditClick(item)}>수정</TextButton>
              ) : (
                <>
                  <Button onClick={() => handleSaveClick(item.seasonId)} disabled={loading}>
                    저장
                  </Button>
                  <Button danger onClick={handleCancelClick} disabled={loading}>
                    취소
                  </Button>
                </>
              )}
            </Cell>
          </Row>
        );
      })}
    </Container>
  );
};

export default CampaignSeasonImagesManagement;
