import React, { useState } from 'react';

const StarRating = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            cursor: 'pointer',
            color: star <= (hovered || rating) ? '#ffc107' : '#e4e5e9',
            fontSize: '24px',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
