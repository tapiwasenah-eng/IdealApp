import React from 'react';
import { Loader2 } from 'lucide-react';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'brand' | 'white' | 'muted';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

const colorMap: Record<SpinnerColor, string> = {
  brand: 'text-[#3B82F6]',
  white: 'text-white',
  muted: 'text-gray-400',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'brand',
  className = '',
}) => {
  return (
    <Loader2
      size={sizeMap[size]}
      className={['animate-spin', colorMap[color], className].filter(Boolean).join(' ')}
      aria-label="Loading"
    />
  );
};

export default Spinner;
