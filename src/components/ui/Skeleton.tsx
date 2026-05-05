import React from 'react';

type SkeletonVariant = 'text' | 'card' | 'circle';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

const resolveSize = (val?: string | number): string | undefined => {
  if (val === undefined) return undefined;
  return typeof val === 'number' ? `${val}px` : val;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
}) => {
  const base = 'animate-pulse bg-gray-200';

  if (variant === 'circle') {
    const sz = resolveSize(width ?? height ?? 40);
    return (
      <div
        className={`${base} rounded-full flex-shrink-0 ${className}`}
        style={{ width: sz, height: sz }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`${base} rounded-xl ${className}`}
        style={{
          width: resolveSize(width) ?? '100%',
          height: resolveSize(height) ?? '160px',
        }}
        aria-hidden="true"
      />
    );
  }

  // text variant — can render multiple lines
  if (lines > 1) {
    return (
      <div className={`flex flex-col gap-2 ${className}`} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${base} rounded-md h-4`}
            style={{
              width: i === lines - 1 ? '60%' : resolveSize(width) ?? '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${base} rounded-md h-4 ${className}`}
      style={{ width: resolveSize(width) ?? '100%' }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
