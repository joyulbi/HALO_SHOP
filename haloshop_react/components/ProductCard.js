import React from 'react';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const isSoldOut = product.inventory_volume === 0;

  const imageUrl = product.images[0]
    ? `http://localhost:8080${product.images[0].url}`
    : '/images/no-image.png';

  return (
    <div
      style={{
        width: '220px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        opacity: isSoldOut ? 0.6 : 1,
      }}
    >
      <Link href={`/items/${product.id}`} passHref>
        <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: isSoldOut ? 'grayscale(80%)' : 'none',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
      </Link>

      <div style={{ padding: '12px 16px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            margin: '8px 0 4px 0',
            lineHeight: '1.4',
            color: '#222',
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: '15px',
            color: isSoldOut ? '#aaa' : '#c8102e',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          {product.price.toLocaleString()}원
        </p>
      </div>

      {isSoldOut && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#c8102e',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          품절
        </div>
      )}
    </div>
  );
};

export default ProductCard;
