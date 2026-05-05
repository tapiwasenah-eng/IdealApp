import React from 'react';

type CardVariant = 'default' | 'elevated' | 'interactive';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white rounded-xl border border-[#E5E7EB]',
  elevated: 'bg-white rounded-xl border border-[#E5E7EB] shadow-md',
  interactive:
    'bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        variantClasses[variant],
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

export default Card;
