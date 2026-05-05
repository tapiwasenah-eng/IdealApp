import React from 'react';
import { cn } from '@/src/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'orange' | 'green' | 'purple';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colorClasses[color])}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
      </div>
    </div>
  );
};
