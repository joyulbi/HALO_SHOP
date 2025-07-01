import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ImageUpload from '../../../components/ImageUpload';

const AdminItemPage = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [teamId, setTeamId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [isMultiUpload, setIsMultiUpload] = useState(false);

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/items');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) { 
      alert('이미지를 업로드해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/items/admin', {
        item: {
          name,
          description,
          price: parseInt(price),
          teamId: parseInt(teamId),
          categoryId: parseInt(categoryId)
        },
        imageUrls
      });

      alert('상품이 등록되었습니다!');
      fetchItems();

      setName('');
      setDescription('');
      setPrice('');
      setTeamId('');
      setCategoryId('');
      setImageUrls([]);

    } catch (error) {
      console.error(error);
      alert('상품 등록에 실패했습니다.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">관리자 상품 등록 페이지</h1>

      <div className="mb-4">
        <label className="mr-4">업로드 모드: </label>
        <label className="mr-2">
          <input
            type="radio"
            name="uploadMode"
            value="single"
            checked={!isMultiUpload}
            onChange={() => setIsMultiUpload(false)}
          />
          단일 이미지
        </label>
        <label>
          <input
            type="radio"
            name="uploadMode"
            value="multi"
            checked={isMultiUpload}
            onChange={() => setIsMultiUpload(true)}
          />
          다중 이미지
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border-2 border-pink-300 p-4 w-[400px] mb-10">
        <div>
          <label>상품 이미지: </label>
          <ImageUpload
            isMultiUpload={isMultiUpload} // 🔥 전달 필수
            onUploadSuccess={(urls) => {
              if (isMultiUpload) {
                setImageUrls((prev) => [...prev, ...urls]); // 다중 추가
              } else {
                setImageUrls(urls); // 단일 덮어쓰기
              }
            }}
          />
        </div>
        <div>
          <label>상품명: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border w-full" required />
        </div>
        <div>
          <label>상품 금액: </label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border w-full" required />
        </div>
        <div>
          <label>상품 설명: </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border w-full" required />
        </div>
        <div>
          <label>카테고리: </label>
          <input type="text" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border w-full" required />
        </div>
        <div>
          <label>팀 선택: </label>
          <input type="text" value={teamId} onChange={(e) => setTeamId(e.target.value)} className="border w-full" required />
        </div>

        <div className="flex space-x-4">
          <button type="reset" className="bg-gray-400 text-white px-4 py-2 rounded">등록 취소</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">상품 등록</button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">상품 목록</h2>
        <div className="grid grid-cols-4 gap-4">
          {items.map(item => {
            console.log('🔥 item.images:', item.images);
            return (
              <div key={item.id} className="border p-4 flex flex-col items-center">
                <img
                  src={item.images[0] ? `http://localhost:8080${item.images[0].url}` : ''}
                  alt={item.name}
                  className="w-32 h-32 object-cover mb-2"
                />
                <p className="font-bold">{item.name}</p>
                <p>{item.price}원</p>
                <p>{item.description}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => router.push(`/admin/items/${item.id}`)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    상품 수정
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminItemPage;
