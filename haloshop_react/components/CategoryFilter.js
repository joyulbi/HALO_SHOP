import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div style={{ marginBottom: '30px', textAlign: 'center' }}>
      <select
        value={selectedCategory ?? ''}  // null일 경우 빈 문자열로 표시
        onChange={(e) => {
          const val = e.target.value;
          onSelectCategory(val === '' ? null : Number(val));
        }}
        style={{
          padding: '8px 12px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      >
        <option value="">전체 카테고리</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
