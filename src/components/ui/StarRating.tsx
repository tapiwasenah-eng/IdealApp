import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  showValue = false,
  className = '',
}) => {
  const clampedRating = Math.min(Math.max(rating, 0), maxStars);

  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rating: ${rating} out of ${maxStars}`}>
      <span className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i + 1 <= Math.floor(clampedRating);
          const half = !filled && i < clampedRating && clampedRating - i >= 0.3;

          return (
            <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
              {/* Background empty star */}
              <Star
                size={size}
                className="text-gray-200"
                fill="currentColor"
                strokeWidth={0}
              />
              {/* Filled or half overlay */}
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? '50%' : '100%' }}
                >
                  <Star
                    size={size}
                    className="text-[#F59E0B]"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </span>
              )}
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs font-medium text-gray-600 ml-0.5">
          {clampedRating.toFixed(1)}
        </span>
      )}
    </span>
  );
};

export default StarRating;
