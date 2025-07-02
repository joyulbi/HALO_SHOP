import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useCategories from '../../../hooks/useCategories';

const EditItemPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const categories = useCategories();
  const [item, setItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchItem = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/items/${id}`);
      console.log('불러온 상품 데이터 👉', res.data);
      setItem(res.data);
      setImagePreview(res.data.images[0] ? `http://localhost:8080${res.data.images[0].url}` : '');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchItem();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify({
    name: item.name,
    description: item.description,
    price: item.price,
    teamId: item.teamId,
    categoryId: item.categoryId
  })], { type: "application/json" }));

    if (item.newImage) {
      formData.append('image', item.newImage);
    }

    console.log('🔥 최종 요청 데이터:', {
    name: item.name,
    description: item.description,
    price: item.price,
    teamId: item.teamId,
    categoryId: item.categoryId
  });

    try {
      await axios.put(`http://localhost:8080/api/items/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('수정 완료');
      router.push('/admin/items');
    } catch (error) {
      console.error(error);
      alert('수정 실패');
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/items/admin/${id}`);
      alert('삭제 완료');
      router.push('/admin/items');
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
        관리자 상품 수정 페이지
      </h1>

      {/* 🔥 flex 구조 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '48px', justifyContent: 'center' }}>
        {/* 왼쪽: 상품 이미지 */}
        <div style={{ width: '300px', height: '300px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imagePreview ? (
            <img src={imagePreview} alt="상품 이미지" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <span>이미지 없음</span>
          )}
        </div>

        {/* 오른쪽: 수정 박스 (상품 등록 박스랑 비슷하게) */}
        <form
          onSubmit={handleUpdate}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            border: '2px solid #f9a8d4',
            padding: '16px',
            width: '400px'
          }}
        >
          <div>
            <label>상품 이미지: </label>
            <input
              type="file"
              onChange={(e) => {
                setItem({ ...item, newImage: e.target.files[0] });
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <div>
            <label>상품명: </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }}
              required
            />
          </div>
          <div>
            <label>상품 금액: </label>
            <input
              type="number"
              value={item.price}
              onChange={(e) => setItem({ ...item, price: e.target.value })}
              style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }}
              required
            />
          </div>
          <div>
            <label>상품 설명: </label>
            <textarea
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }}
              required
            />
          </div>
          <div>
            <label>카테고리: </label>
            <select
              value={String(item.categoryId)} // ✅ 무조건 문자열로
              onChange={(e) => setItem({ ...item, categoryId: parseInt(e.target.value) })} // ✅ 숫자로 저장
              style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }}
              required
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>팀 선택: </label>
            <input
              type="text"
              value={item.teamId}
              onChange={(e) => setItem({ ...item, teamId: e.target.value })}
              style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="button"
              onClick={() => router.push('/admin/items')}
              style={{ backgroundColor: '#9ca3af', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              수정 취소
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              수정 완료
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              상품 삭제
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemPage;
