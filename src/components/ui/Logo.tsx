import React from 'react';
import { Link } from 'react-router-dom';

const AiBrandIcon = ({ className }: { className?: string }) => {
  const particles = [];
  
  // Concentric rings forming a glowing, pulsing north star
  const numRings = 9;
  for (let r = 0; r < numRings; r++) {
    // Number of dots scales with radius to keep density consistent
    const dotsCount = 12 + (r * 12); 
    // Base circular radius
    const baseRadius = 4 + (r * 3.4); 
    
    for (let i = 0; i < dotsCount; i++) {
        const angle = (i * Math.PI * 2) / dotsCount;
        
        // Create 4 distinct lobes (North Star points)
        // We use Math.pow(..., 3) to make the points sharper and narrower
        const lobeIntensity = Math.pow((Math.cos(angle * 4) + 1) / 2, 3);
        
        // Push dots outward at the star points
        const radiusExtension = lobeIntensity * (r * 2.8 + 1); 
        const radius = baseRadius + radiusExtension;
        
        // Rotate the star points slightly to create a dynamic spiral "galaxy" look
        // The outer points twist by some degrees relative to the core
        const plotAngle = angle + (r * 0.08);
        
        const x = 50 + Math.cos(plotAngle) * radius;
        const y = 50 + Math.sin(plotAngle) * radius;
        
        // Particles are larger in the center and at the star points
        const size = Math.max(0.4, 3.2 - (r * 0.28) + (lobeIntensity * 1.5));
        
        // Opacity is highest in the center and along the star's glowing arms
        const opacity = Math.max(0.15, 0.9 - (r * 0.08) + (lobeIntensity * 0.4));
        
        particles.push(
          <circle 
            key={`r-${r}-d-${i}`}
            cx={x} 
            cy={y} 
            r={size} 
            fill="currentColor" 
            opacity={Math.min(1, opacity)}
          />
        );
    }
  }

  // Dense central core
  particles.push(<circle key="core" cx="50" cy="50" r="4.5" fill="currentColor" />);

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {particles}
    </svg>
  );
};

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
    default: { text: 'text-gray-800', subtext: 'text-gray-800', icon: 'text-gray-800' },
    white: { text: 'text-white', subtext: 'text-white', icon: 'text-white' },
    dark: { text: 'text-gray-800', subtext: 'text-gray-800', icon: 'text-gray-800' },
  };

  const s = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  const c = colorMap[color];

  const mark = (
    <div className={`${s.icon} flex-shrink-0`}>
      <AiBrandIcon className={`w-full h-full ${c.icon}`} />
    </div>
  );

  const wordmark = (
    <span className={`font-bold ${s.text} ${c.text} leading-none tracking-tight`}>
      Ideal<span className={c.subtext}>App</span>
    </span>
  );

  const content = (
    <div className={`flex items-center justify-center ${className}`}>
      {mark}
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
