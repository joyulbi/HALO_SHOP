// Seasons.jsx
import React, { useState, useEffect } from "react";
import SeasonFormModal from "../../components/SeasonFormModal";

const initialSeasons = [
  {
    id: 1,
    name: "2025년 여름 시즌",
    startDate: "2025-06-01T00:00:00",
    endDate: "2025-08-31T23:59:59",
    level_1: 1000,
    level_2: 2000,
    level_3: 3000,
    createdAt: "2025-07-01T11:50:19.541066",
    campaigns: [],
  },
];

const Seasons = () => {
  const [seasons, setSeasons] = useState(initialSeasons);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredSeasons, setFilteredSeasons] = useState(initialSeasons);

  const initialForm = {
    id: null,
    name: "",
    startDate: "",
    endDate: "",
    level_1: "",
    level_2: "",
    level_3: "",
  };

  const [form, setForm] = useState(initialForm);
  const [editingSeason, setEditingSeason] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 검색어에 따라 filteredSeasons 업데이트
useEffect(() => {
  setFilteredSeasons(
    seasons.filter((s) => s.name && s.name.toLowerCase().includes(searchKeyword.toLowerCase()))
  );
}, [searchKeyword, seasons]);

  // 입력폼 변경
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 새 시즌 생성 또는 기존 시즌 수정 저장
const onSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.startDate || !form.endDate) {
    alert("이름, 시작일, 종료일은 필수입니다.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/seasons", {
      method: editingSeason ? "PUT" : "POST",  // PUT은 수정용이라면
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        startDate: form.startDate + "T00:00:00",
        endDate: form.endDate + "T23:59:59",
        level_1: Number(form.level_1) || 0,
        level_2: Number(form.level_2) || 0,
        level_3: Number(form.level_3) || 0,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);  // 서버 메시지 출력
      setSeasons((prev) =>
        editingSeason
          ? prev.map((s) => (s.id === editingSeason.id ? data.season : s))
          : [...prev, data.season]
      );
      setIsModalOpen(false);
      setForm(initialForm);
      setEditingSeason(null);
    } else {
      alert(data.message || "시즌 생성 실패");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("네트워크 오류가 발생했습니다");
  }
};

  // 삭제
  const onDelete = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setSeasons((prev) => prev.filter((s) => s.id !== id));
      if (editingSeason && editingSeason.id === id) {
        setEditingSeason(null);
        setForm(initialForm);
      }
    }
  };

  // 수정 버튼 클릭
  const onEdit = (season) => {
    setEditingSeason(season);
    setForm({
      id: season.id,
      name: season.name,
      startDate: season.startDate.slice(0, 10),
      endDate: season.endDate.slice(0, 10),
      level_1: season.level_1,
      level_2: season.level_2,
      level_3: season.level_3,
    });
    setIsModalOpen(true);
  };

  // 새 시즌 생성 모달 열기
  const openCreateModal = () => {
    setEditingSeason(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSeason(null);
    setForm(initialForm);
  };

    // 처음 마운트 시 서버 데이터 로딩
  useEffect(() => {
    fetch("http://localhost:8080/api/seasons")
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data);
      })
      .catch((error) => {
        console.error("시즌 데이터를 불러오는데 실패했습니다.", error);
      });
  }, []);

    useEffect(() => {
    setFilteredSeasons(
      seasons.filter(
        (s) => s.name && s.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  }, [searchKeyword, seasons]);

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Season Admin</h1>

      <input
        type="text"
        placeholder="시즌명 검색"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ marginBottom: 20, width: "100%", padding: 8, fontSize: 16 }}
      />

      <button onClick={openCreateModal} style={{ marginBottom: 10 }}>
        새 시즌 생성
      </button>

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>시즌 이름</th>
            <th>시작일</th>
            <th>마감일</th>
            <th>1단계</th>
            <th>2단계</th>
            <th>3단계</th>
            <th>생성일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredSeasons.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                결과가 없습니다.
              </td>
            </tr>
          ) : (
            filteredSeasons.map((season) => (
              <tr key={season.id}>
                <td>{season.id}</td>
                <td>{season.name}</td>
                <td>{new Date(season.startDate).toLocaleDateString()}</td>
                <td>{new Date(season.endDate).toLocaleDateString()}</td>
                <td>{season.level_1}</td>
                <td>{season.level_2}</td>
                <td>{season.level_3}</td>
                <td>{new Date(season.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => onEdit(season)} style={{ marginRight: 8 }}>
                    수정
                  </button>
                  <button onClick={() => onDelete(season.id)}>삭제</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <SeasonFormModal
        visible={isModalOpen}
        onClose={closeModal}
        onSubmit={onSubmit}
        form={form}
        onChange={onChange}
        editing={!!editingSeason}
      />
    </div>
  );
};

export default Seasons;
