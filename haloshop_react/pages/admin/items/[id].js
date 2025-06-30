import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditItemPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchItem = async () => {
    try {
      const res = await axios.get(`/api/items/${id}`);
      setItem(res.data);
      setImagePreview(res.data.imageUrl);
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
    formData.append('name', item.name);
    formData.append('description', item.description);
    formData.append('price', item.price);
    formData.append('teamId', item.teamId);
    formData.append('categoryId', item.categoryId);
    if (item.newImage) {
      formData.append('image', item.newImage);
    }

    try {
      await axios.put(`/api/admin/items/${id}`, formData, {
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
      await axios.delete(`/api/admin/items/${id}`);
      alert('삭제 완료');
      router.push('/admin/items');
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">관리자 상품 수정 페이지</h1>
      <div className="flex">
        <img src={imagePreview} alt="상품 이미지" className="w-80 h-80 object-cover mr-8" />
        <form onSubmit={handleUpdate} className="space-y-4 border-2 border-pink-300 p-4 w-[400px]">
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
              className="border w-full"
              required
            />
          </div>
          <div>
            <label>상품 금액: </label>
            <input
              type="number"
              value={item.price}
              onChange={(e) => setItem({ ...item, price: e.target.value })}
              className="border w-full"
              required
            />
          </div>
          <div>
            <label>상품 설명: </label>
            <textarea
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              className="border w-full"
              required
            />
          </div>
          <div>
            <label>카테고리: </label>
            <input
              type="text"
              value={item.categoryId}
              onChange={(e) => setItem({ ...item, categoryId: e.target.value })}
              className="border w-full"
              required
            />
          </div>
          <div>
            <label>팀 선택: </label>
            <input
              type="text"
              value={item.teamId}
              onChange={(e) => setItem({ ...item, teamId: e.target.value })}
              className="border w-full"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/items')}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              수정 취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              수정 완료
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
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
