import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 6px 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  color: white;
  background-color: ${({ danger }) => (danger ? "#dc3545" : "#007bff")};
`;

const TeamCreateModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("팀 이름을 입력해주세요.");
      return;
    }

    const firstConfirm = window.confirm(
      `정말로 "${trimmedName}" 팀을 생성하시겠습니까?\n\n팀 생성 시 삭제할 수 없습니다.`
    );
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      `"${trimmedName}" 팀 생성을 최종 확인합니다.\n진행하시겠습니까?`
    );
    if (!secondConfirm) return;

    try {
      await axios.post("http://localhost:8080/api/teams", { name: trimmedName });
      alert("생성 완료!");
      onCreated?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("생성 실패");
    }
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <h4>팀 생성</h4>
        <Input
          placeholder="팀 이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ButtonGroup>
          <Button onClick={handleCreate}>생성</Button>
          <Button danger onClick={onClose}>취소</Button>
        </ButtonGroup>
      </ModalBox>
    </ModalOverlay>
  );
};

export default TeamCreateModal;
