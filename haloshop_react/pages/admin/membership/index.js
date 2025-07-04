// pages/admin/membership/index.js

import { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">멤버십 관리</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="멤버십 이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="기준 사용 금액"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="적립 포인트"
          value={form.pricePoint}
          onChange={(e) => setForm({ ...form, pricePoint: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? '수정' : '추가'}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">이름</th>
            <th className="border p-2">기준 금액</th>
            <th className="border p-2">적립 포인트</th>
            <th className="border p-2">액션</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((m) => (
            <tr key={m.id}>
              <td className="border p-2 text-center">{m.id}</td>
              <td className="border p-2 text-center">{m.name}</td>
              <td className="border p-2 text-center">{m.price}</td>
              <td className="border p-2 text-center">{m.pricePoint}</td>
              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={() => startEdit(m)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
