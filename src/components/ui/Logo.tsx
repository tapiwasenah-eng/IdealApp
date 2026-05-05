import React from 'react';
import { Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  href?: string;
  className?: string;
  color?: 'default' | 'white' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  href = '/',
  className = '',
  color = 'default',
}) => {
  const sizeMap = {
    sm: { icon: 'w-3 h-3', text: 'text-[8px]', initials: 'text-[6px]' },
    md: { icon: 'w-4 h-4', text: 'text-xs', initials: 'text-[8px]' },
    lg: { icon: 'w-5 h-5', text: 'text-sm', initials: 'text-[10px]' },
    xl: { icon: 'w-10 h-10', text: 'text-xl', initials: 'text-[12px]' },
    '2xl': { icon: 'w-20 h-20', text: 'text-3xl', initials: 'text-base' },
  };

  const colorMap = {
    default: { text: 'text-slate-900', subtext: 'text-emerald-500' },
    white: { text: 'text-white', subtext: 'text-white' },
    dark: { text: 'text-slate-900', subtext: 'text-emerald-500' },
  };

  const s = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  const c = colorMap[color];

  const mark = (
    <div className={`${s.icon} flex-shrink-0`}>
      <Hexagon className="w-full h-full text-indigo-600 fill-indigo-600/20" />
    </div>
  );

  const wordmark = (
    <span className={`font-bold ${s.text} ${c.text} leading-none tracking-tight`}>
      Ideal<span className={c.subtext}>App</span>
    </span>
  );

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {variant !== 'wordmark' && mark}
      {variant !== 'mark' && wordmark}
    </div>
  );

  if (!href) return content;

  return (
    <Link to={href} className="flex items-center">
      {content}
    </Link>
  );
};

export default Logo;
