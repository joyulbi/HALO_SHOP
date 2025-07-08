import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import TeamCreateModal from "../../components/TeamCreateModal";
import AdminLayout from './AdminLayout';

const Container = styled.div`
  width: 60vw;
  margin: 1rem auto;
  padding: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 12px;
  border-bottom: 2px solid #ccc;
  background-color: #f0f0f0;
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  color: ${({ inactive }) => (inactive ? "#999" : "inherit")};
`;

const Tr = styled.tr`
  background-color: ${({ inactive }) => (inactive ? "#fafafa" : "inherit")};
`;

const Input = styled.input`
  width: 100%;
  padding: 4px 6px;
  box-sizing: border-box;
`;

const Checkbox = styled.input`
  transform: scale(1.2);
  margin-left: 0.5rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  margin-right: 0.5rem;
  padding: 6px 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  color: white;
  background-color: ${({ danger }) => (danger ? "#dc3545" : "#007bff")};
  font-size: 0.9rem;

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const StatusCircle = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? "green" : "red")};
  margin-right: 8px;
  vertical-align: middle;
`;

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", active: true });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchTeams = () => {
    axios
      .get("http://localhost:8080/api/teams")
      .then((res) => {
        const sorted = res.data.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
        setTeams(sorted);
      })
      .catch((err) => {
        console.error("팀 데이터 로딩 실패:", err);
      });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const startEditing = (team) => {
    setEditingId(team.id);
    setEditForm({ name: team.name, active: team.active });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveChanges = async (id) => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:8080/api/teams/${id}`, {
        name: editForm.name,
        active: editForm.active,
      });

      setTeams((prev) => {
        const updated = prev.map((t) =>
          t.id === id ? { ...t, name: editForm.name, active: editForm.active } : t
        );
        return updated.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
      });

      setEditingId(null);
      alert("저장 성공!");
    } catch (error) {
      console.error(error);
      alert("저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
    <Container>
      <h3>팀 설정</h3>
      <ButtonWrapper>
        <Button onClick={() => setShowModal(true)}>+ 팀 생성</Button>
      </ButtonWrapper>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>팀 이름</Th>
            <Th>활성화 상태</Th>
            <Th>관리</Th>
          </tr>
        </thead>
        <tbody>
          {teams.map(({ id, name, active }) => {
            const isEditing = editingId === id;
            return (
              <Tr key={id} inactive={!active}>
                <Td inactive={!active}>{id}</Td>
                <Td inactive={!active}>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  ) : (
                    name
                  )}
                </Td>
                <Td inactive={!active}>
                  {isEditing ? (
                    <label>
                      활성화
                      <Checkbox
                        type="checkbox"
                        name="active"
                        checked={editForm.active}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </label>
                  ) : (
                    <>
                      <StatusCircle active={active} />
                      {active ? "활성" : "비활성"}
                    </>
                  )}
                </Td>
                <Td inactive={!active}>
                  {isEditing ? (
                    <>
                      <Button onClick={() => saveChanges(id)} disabled={loading}>
                        저장
                      </Button>
                      <Button danger onClick={cancelEditing} disabled={loading}>
                        취소
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => startEditing({ id, name, active })}>수정</Button>
                  )}
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
      {showModal && (
        <TeamCreateModal onClose={() => setShowModal(false)} onCreated={fetchTeams} />
      )}
    </Container>
    </AdminLayout>
  );
};

export default TeamManagement;
