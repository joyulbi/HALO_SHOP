import React from 'react';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const isSoldOut = product.inventory_volume === 0;

  return (
    <div
      style={{
        width: '200px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        position: 'relative',
        opacity: isSoldOut ? 0.6 : 1,
        cursor: 'pointer',
      }}
    >
      <Link href={`/items/${product.id}`}>
        <img
          src={product.images[0] ? `http://localhost:8080${product.images[0].url}` : ''}
          alt={product.name}
          style={{
            width: '100%',
            height: 'auto',
            filter: isSoldOut ? 'grayscale(70%)' : 'none',
            borderRadius: '4px',
          }}
        />
      </Link>

      <h3 style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        {product.name}
      </h3>

      <p style={{ color: isSoldOut ? '#999' : '#000', fontSize: '15px' }}>
        {product.price.toLocaleString()}원
      </p>

      {isSoldOut && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(200, 16, 46, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          품절
        </div>
      )}
    </div>
  );
};

export default ProductCard;
