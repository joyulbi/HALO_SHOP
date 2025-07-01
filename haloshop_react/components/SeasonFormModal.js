import React from "react";

const SeasonFormModal = ({ visible, onClose, onSubmit, form, onChange, editing }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          width: 400,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <h2>{editing ? "시즌 수정" : "새 시즌 생성"}</h2>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>
              이름:{" "}
              <input name="name" value={form.name} onChange={onChange} required />
            </label>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>
              시작일:{" "}
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>
              종료일:{" "}
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>
              Level 1 기준:{" "}
              <input
                name="level_1"
                type="number"
                value={form.level_1}
                onChange={onChange}
                min={0}
              />
            </label>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>
              Level 2 기준:{" "}
              <input
                name="level_2"
                type="number"
                value={form.level_2}
                onChange={onChange}
                min={0}
              />
            </label>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>
              Level 3 기준:{" "}
              <input
                name="level_3"
                type="number"
                value={form.level_3}
                onChange={onChange}
                min={0}
              />
            </label>
          </div>

          <button type="submit" style={{ marginRight: 8 }}>
            {editing ? "수정 저장" : "생성"}
          </button>
          <button type="button" onClick={onClose}>
            닫기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SeasonFormModal;
