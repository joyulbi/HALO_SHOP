import React from 'react';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  return (
    <div style={{ width: '200px', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
      <Link href={`/items/${product.id}`}>
        <img
          src={product.images[0] ? `http://localhost:8080${product.images[0].url}` : ''}
          alt={product.name}
          style={{ width: '100%' }}
        />
      </Link>
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString()}원</p>
    </div>
  );
};

export default ProductCard;
