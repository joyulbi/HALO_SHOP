import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import TeamFilter from '../../components/TeamFilter';
import CategoryFilter from '../../components/CategoryFilter';
import SearchBar from '../../components/SearchBar';
import api from '../../utils/axios';

const ItemListPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 팀 목록
const teams = [
  { id: 1, name: '기아', logoUrl: '/images/teamlogo/기아로고.png' },
  { id: 2, name: '두산', logoUrl: '/images/teamlogo/두산로고.png' },
  { id: 3, name: '롯데', logoUrl: '/images/teamlogo/롯데로고.png' },
  { id: 4, name: '삼성', logoUrl: '/images/teamlogo/삼성로고.png' },
  { id: 5, name: '한화', logoUrl: '/images/teamlogo/한화로고.png' },
  { id: 6, name: '키움', logoUrl: '/images/teamlogo/키움로고.png' },
  { id: 7, name: 'KT', logoUrl: '/images/teamlogo/KT로고.png' },
  { id: 8, name: 'LG', logoUrl: '/images/teamlogo/LG로고.png' },
  { id: 9, name: 'NC', logoUrl: '/images/teamlogo/NC로고.png' },
  { id: 10, name: 'SSG', logoUrl: '/images/teamlogo/SSG로고.png' }
];

  // 카테고리 목록
const categories = [
  { id: 1, name: '유니폼' },
  { id: 2, name: '모자' },
  { id: 3, name: '휴대폰 케이스' },
  { id: 4, name: '야구용품' },
  { id: 5, name: '응원/굿즈' },
  { id: 6, name: '기타' }
];

  // 전체 상품 가져오기
  useEffect(() => {
    api.get('/api/items')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => console.error('상품 목록 불러오기 실패:', err));
  }, []);

  // 필터 적용 함수
  const applyFilters = (teamId, categoryId, keyword = '') => {
    let filtered = products;

    if (teamId !== null) {
      filtered = filtered.filter(product => product.teamId === teamId);
    }

    if (categoryId !== null && categoryId !== '') {
      filtered = filtered.filter(product => product.categoryId === categoryId);
    }

    if (keyword.trim() !== '') {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(keyword.toLowerCase()));
    }

    setFilteredProducts(filtered);
  };

  // 팀 필터 선택
const handleSelectTeam = (teamId) => {
  const newTeamId = teamId === selectedTeam ? null : teamId;  // 👈 같으면 null로 토글
  setSelectedTeam(newTeamId);
  applyFilters(newTeamId, selectedCategory, searchKeyword);
};

  // 카테고리 필터 선택
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    applyFilters(selectedTeam, categoryId, searchKeyword);
  };

  // 검색어 변경
  const handleSearchChange = (keyword) => {
    setSearchKeyword(keyword);
    applyFilters(selectedTeam, selectedCategory, keyword);
  };

  return (
    <>
      <h1 style={{ marginBottom: '30px' }}>상품 목록</h1>

      {/* 🔥 검색창 컴포넌트 */}
      <SearchBar searchKeyword={searchKeyword} onChange={handleSearchChange} />

      {/* 🔥 팀 필터 + 카테고리 필터 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        marginBottom: '30px'
      }}>
        <TeamFilter teams={teams} selectedTeam={selectedTeam} onSelectTeam={handleSelectTeam} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* 상품 카드 뿌리기 */}
      <section className="product-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', marginTop: '30px' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </section>
    </>
  );
};

export default ItemListPage;
