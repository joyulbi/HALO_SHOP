import { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import AdminLayout from '../AdminLayout';

export default function MembershipAdminPage() {
  const [memberships, setMemberships] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', pricePoint: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchMemberships = async () => {
    const res = await axios.get('/api/membership');
    setMemberships(res.data);
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/membership/${editingId}`, form);
    } else {
      await axios.post('/api/membership', form);
    }
    setForm({ name: '', price: '', pricePoint: '' });
    setEditingId(null);
    fetchMemberships();
  };

  const handleDelete = async (id) => {
    if (confirm('삭제하시겠습니까?')) {
      await axios.delete(`/api/membership/${id}`);
      fetchMemberships();
    }
  };

  const startEdit = (membership) => {
    setForm({
      name: membership.name,
      price: membership.price,
      pricePoint: membership.pricePoint,
    });
    setEditingId(membership.id);
  };

  return (
    <AdminLayout>
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      padding: '30px',
      border: '1px solid #ccc',
      borderRadius: '12px',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
        멤버십 관리
      </h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="멤버십 이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '12px',
            border: '1px solid #aaa',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <input
          type="number"
          placeholder="기준 사용 금액"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '12px',
            border: '1px solid #aaa',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <input
          type="number"
          placeholder="적립 포인트"
          value={form.pricePoint}
          onChange={(e) => setForm({ ...form, pricePoint: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '12px',
            border: '1px solid #aaa',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          {editingId ? '수정' : '추가'}
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#eaeaea' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>이름</th>
            <th style={thStyle}>기준 금액</th>
            <th style={thStyle}>적립 포인트</th>
            <th style={thStyle}>액션</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((m) => (
            <tr key={m.id}>
              <td style={tdStyle}>{m.id}</td>
              <td style={tdStyle}>{m.name}</td>
              <td style={tdStyle}>{m.price}</td>
              <td style={tdStyle}>{m.pricePoint}</td>
              <td style={{ ...tdStyle, display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  onClick={() => startEdit(m)}
                  style={editBtnStyle}
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  style={deleteBtnStyle}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
}

const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center',
  fontWeight: 'bold'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center'
};

const editBtnStyle = {
  padding: '6px 12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteBtnStyle = {
  padding: '6px 12px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
