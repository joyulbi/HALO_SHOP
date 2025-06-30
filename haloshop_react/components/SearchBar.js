import React from 'react';

const SearchBar = ({ searchKeyword, onChange }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <input
        type="text"
        placeholder="상품명 검색"
        value={searchKeyword}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', width: '300px' }}
      />
    </div>
  );
};

export default SearchBar;
