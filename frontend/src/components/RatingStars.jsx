import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './RatingStars.css';

const RatingStars = ({
  rating = 0,
  max = 5,
  interactive = false,
  onChange,
  size = 18,
  showValue = false,
  count
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const current = hoverRating || rating;

  return (
    <div className={`rating-stars-wrapper ${interactive ? 'interactive' : ''}`}>
      <div className="stars-row">
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= current;
          return (
            <button
              type="button"
              key={index}
              className={`star-btn ${isFilled ? 'filled' : 'empty'}`}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              aria-label={`Rate ${starValue} of ${max} stars`}
            >
              <Star
                size={size}
                fill={isFilled ? '#F5A623' : 'transparent'}
                stroke={isFilled ? '#F5A623' : '#D5C2B4'}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="rating-value-label">
          {rating ? Number(rating).toFixed(1) : 'New'}
        </span>
      )}
      {count !== undefined && (
        <span className="rating-count-label">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
