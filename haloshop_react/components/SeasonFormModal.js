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
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          width: 420,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>
          {editing ? "✏️ 시즌 수정" : "➕ 새 시즌 생성"}
        </h2>

        <form onSubmit={onSubmit}>
          {[
            { label: "이름", name: "name", type: "text", required: true },
            { label: "시작일", name: "startDate", type: "date", required: true },
            { label: "종료일", name: "endDate", type: "date", required: true },
            { label: "Level 1 기준", name: "level_1", type: "number" },
            { label: "Level 2 기준", name: "level_2", type: "number" },
            { label: "Level 3 기준", name: "level_3", type: "number" },
          ].map(({ label, name, type, required }) => (
            <div
              key={name}
              style={{
                marginBottom: 14,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label style={{ marginBottom: 4, fontWeight: 500 }}>{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={onChange}
                required={required}
                min={type === "number" ? 0 : undefined}
                style={{
                  padding: "8px 10px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {editing ? "수정 저장" : "생성"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 6,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeasonFormModal;
