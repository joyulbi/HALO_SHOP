import { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import { useRouter } from 'next/router';
import ImageUpload from '../../../components/ImageUpload';
import useCategories from '../../../hooks/useCategories';
import AdminLayout from '../AdminLayout';

const AdminItemPage = () => {
  const router = useRouter();
  const categories = useCategories();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [teamId, setTeamId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [isMultiUpload, setIsMultiUpload] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [useSuggestedTitle, setUseSuggestedTitle] = useState(false);

  const [items, setItems] = useState([]);
  const [teams, setTeams] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/items');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNameChange = async (e) => {
  const value = e.target.value;
  setName(value);

  if (value.length > 1) { // 2글자 이상일 때만 요청
    try {
      const res = await axios.get(`http://localhost:8080/api/ai-suggest?name=${value}`);
      setAiSuggestion(res.data); // 추천 문구 저장
    } catch (error) {
      console.error('AI 추천 실패:', error);
      setAiSuggestion('추천 문구를 가져오지 못했습니다.');
    }
  } else {
    setAiSuggestion('');
  }
};

  const fetchTeams = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/teams');
      setTeams(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchTeams();
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
          name: useSuggestedTitle ? `${aiSuggestion} ${name}` : name, // ✅ 요기만 수정
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
    <AdminLayout>
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>관리자 상품 등록 페이지</h1>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ marginRight: '16px' }}>업로드 모드: </label>
        <label style={{ marginRight: '8px' }}>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid #f9a8d4', padding: '16px', width: '800px', marginBottom: '40px' }}>
        <div>
          <label>상품 이미지: </label>
          <ImageUpload
            isMultiUpload={isMultiUpload}
            onUploadSuccess={(urls) => {
              if (isMultiUpload) {
                setImageUrls((prev) => [...prev, ...urls]);
              } else {
                setImageUrls(urls);
              }
            }}
          />
          {/* 🔥 업로드한 이미지 미리보기 */}
        </div>

        <div>
          <label>상품명: </label>
          <input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }} 
            required 
          />
        </div>

          {aiSuggestion && (
          <div style={{ marginTop: '8px', backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
            <strong>추천 제목: </strong> {aiSuggestion}
            <div style={{ marginTop: '4px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={useSuggestedTitle}
                  onChange={() => setUseSuggestedTitle(!useSuggestedTitle)}
                  style={{ marginRight: '4px' }}
                />
                제안 제목 사용하기
              </label>
            </div>
          </div>
        )}

        <div>
          <label>상품 금액: </label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }} required />
        </div>
        <div>
          <label>상품 설명: </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }} required />
        </div>
        <div>
          <label>카테고리: </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
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
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            style={{ border: '1px solid #ddd', width: '100%', padding: '4px' }}
            required
          >
            <option value="">팀을 선택하세요</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="reset" style={{ backgroundColor: '#9ca3af', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>등록 취소</button>
          <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>상품 등록</button>
        </div>
      </form>

      {/* ✅ 화면 가득 확장 시작 */}
      <div style={{ width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)', padding: '0 40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>상품 목록</h2>

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {items.map(item => {
              console.log('🔥 item.images:', item.images);
              return (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
                >
                  <img
                    src={item.images[0] ? `http://localhost:8080${item.images[0].url}` : ''}
                    alt={item.name}
                    style={{ width: '128px', height: '128px', objectFit: 'cover', marginBottom: '8px' }}
                    fetchpriority="high"
                  />
                  <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                  <p>{item.price}원</p>
                  <p style={{ textAlign: 'center' }}>{item.description}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => router.push(`/admin/items/${item.id}`)}
                      style={{ backgroundColor: '#facc15', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
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
      {/* ✅ 화면 가득 확장 끝 */}
    </div>
    </AdminLayout>
  );
};

export default AdminItemPage;
