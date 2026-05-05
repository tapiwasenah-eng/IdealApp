import React from 'react';

type BadgeVariant = 'popular' | 'new' | 'pro' | 'status';
type StatusType = 'in_progress' | 'completed' | 'complete' | 'review' | 'draft' | 'generating' | 'error' | 'published' | 'archived';

interface BadgeProps {
  variant?: BadgeVariant;
  status?: StatusType | string;
  children?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Exclude<BadgeVariant, 'status'>, string> = {
  popular: 'bg-green-100 text-green-700',
  new: 'bg-green-100 text-green-700',
  pro: 'bg-purple-100 text-purple-700',
};

const statusClasses: Record<string, string> = {
  in_progress: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  complete: 'bg-green-100 text-green-700',
  review: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
  generating: 'bg-blue-100 text-blue-700 animate-pulse',
  error: 'bg-red-100 text-red-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-600',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'status',
  status,
  children,
  className = '',
}) => {
  let colorClasses: string;

  if (status) {
    colorClasses = statusClasses[status];
  } else if (variant !== 'status') {
    colorClasses = variantClasses[variant as Exclude<BadgeVariant, 'status'>];
  } else {
    colorClasses = 'bg-gray-100 text-gray-600';
  }

  const content = children || (status ? status.replace('_', ' ') : '');

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        colorClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {content}
    </span>
  );
};

export default Badge;
