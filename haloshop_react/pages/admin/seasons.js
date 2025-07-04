// Seasons.jsx
import React, { useState, useEffect } from "react";
import { CalendarTwoTone } from "@ant-design/icons";
import SeasonFormModal from "../../components/SeasonFormModal";

const Seasons = () => {

  // 시즌 조회용
  const [seasons, setSeasons] = useState([]);
  const [filteredSeasons, setFilteredSeasons] = useState([]);

  // 시즌 검색용
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

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
  let filtered = seasons;

  // 이름 or ID로 필터
  if (searchKeyword.trim() !== "") {
    filtered = filtered.filter((s) => {
      if (searchType === "name") {
        return s.name && s.name.toLowerCase().includes(searchKeyword.toLowerCase());
      } else if (searchType === "id") {
        return s.id?.toString().includes(searchKeyword);
      }
      return true;
    });
  }

  // 날짜 범위 필터
  if (filterStartDate) {
    filtered = filtered.filter((s) => new Date(s.startDate) >= new Date(filterStartDate));
  }
  if (filterEndDate) {
    filtered = filtered.filter((s) => new Date(s.endDate) <= new Date(filterEndDate));
  }

  setFilteredSeasons(filtered);
}, [searchKeyword, searchType, filterStartDate, filterEndDate, seasons]);

  // 입력폼 변경
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //
  // 새 시즌 생성 또는 기존 시즌 수정 저장
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.startDate || !form.endDate) {
      alert("이름, 시작일, 종료일은 필수입니다.");
      return;
    }

    const isEditing = !!editingSeason;
    const url = isEditing
      ? `http://localhost:8080/api/seasons/${editingSeason.id}`
      : "http://localhost:8080/api/seasons";

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
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
        alert(data.message || "저장되었습니다.");
        setSeasons((prev) =>
          isEditing
            ? prev.map((s) => (s.id === editingSeason.id ? data.season : s))
            : [...prev, data.season]
        );
        setIsModalOpen(false);
        setForm(initialForm);
        setEditingSeason(null);
      } else {
        alert(data.message || "시즌 저장 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("네트워크 오류가 발생했습니다");
    }
  };

  // 삭제
  const onDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/seasons/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("시즌이 삭제되었습니다.");
        setSeasons((prev) => prev.filter((s) => s.id !== id));
        if (editingSeason && editingSeason.id === id) {
          setEditingSeason(null);
          setForm(initialForm);
        }
      } else {
        const data = await response.text(); // 서버에서 메시지 반환 시
        alert(data || "시즌 삭제 실패");
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("네트워크 오류로 삭제에 실패했습니다.");
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

  return (
<div style={{ maxWidth: "100%", padding: "32px" }}>
  <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}><CalendarTwoTone /> 시즌 관리</h1>

  {/* 필터 영역 */}
  <fieldset
    style={{
      display: "flex",
      gap: "12px",
      marginBottom: 24,
      alignItems: "center",
      flexWrap: "wrap",
      padding: "12px 16px",
      border: "1px solid #ddd",
      borderRadius: 8,
      backgroundColor: "#f9f9f9",
    }}
  >
    <select
      value={searchType}
      onChange={(e) => setSearchType(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: 4,
        border: "1px solid #ccc",
        minWidth: 120,
      }}
    >
      <option value="name">시즌 이름</option>
      <option value="id">ID</option>
    </select>

    <input
      type="text"
      placeholder="검색어 입력"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: 4,
        border: "1px solid #ccc",
        flex: 1,
        minWidth: 160,
      }}
    />

    <label style={{ fontSize: 14 }}>시작일</label>
    <input
      type="date"
      value={filterStartDate}
      onChange={(e) => setFilterStartDate(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: 4,
        border: "1px solid #ccc",
      }}
    />
    <label style={{ fontSize: 14 }}>~ 종료일</label>
    <input
      type="date"
      value={filterEndDate}
      onChange={(e) => setFilterEndDate(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: 4,
        border: "1px solid #ccc",
      }}
    />
  </fieldset>

  <button
    onClick={openCreateModal}
    style={{
      padding: "10px 16px",
      marginBottom: 20,
      backgroundColor: "#0070f3",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
    }}
  >
    ➕ 새 시즌 생성
  </button>

{/* 시즌 테이블 */}
<div style={{ overflowX: "auto" }}>
  <table
    style={{
      minWidth: "1100px", // 💡 너비 확보
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#fff",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    }}
  >
    <thead style={{ backgroundColor: "#f1f1f1" }}>
      <tr>
        {[
          "ID",
          "시즌 이름",
          "시작일",
          "마감일",
          "1단계",
          "2단계",
          "3단계",
          "생성일",
          "관리",
        ].map((h) => (
          <th
            key={h}
            style={{
              padding: "12px",
              borderBottom: "1px solid #ddd",
              fontWeight: 600,
              fontSize: 14,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {filteredSeasons.length === 0 ? (
        <tr>
          <td colSpan="9" style={{ textAlign: "center", padding: 20 }}>
            결과가 없습니다.
          </td>
        </tr>
      ) : (
        filteredSeasons.map((season) => (
          <tr key={season.id} style={{ textAlign: "center", borderBottom: "1px solid #eee" }}>
            <td style={{ padding: 10 }}>{season.id}</td>
            <td>{season.name}</td>
            <td>{new Date(season.startDate).toLocaleDateString()}</td>
            <td>{new Date(season.endDate).toLocaleDateString()}</td>
            <td>{season.level_1}</td>
            <td>{season.level_2}</td>
            <td>{season.level_3}</td>
            <td>{new Date(season.createdAt).toLocaleString()}</td>
            <td>
              <button
                onClick={() => onEdit(season)}
                style={{
                  marginRight: 6,
                  padding: "4px 8px",
                  backgroundColor: "#ffaa00",
                  color: "#000",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                수정
              </button>
              <button
                onClick={() => onDelete(season.id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#e00",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

  {/* 모달 컴포넌트 */}
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
