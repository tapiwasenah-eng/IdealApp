import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
  borderColor,
}) => {
  return (
    <div
      className={`${bgColor} border ${borderColor} rounded-xl p-6 flex flex-col justify-between min-h-[136px]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#6B7280] mb-1">{title}</p>
          <p className={`text-3xl font-black ${textColor}`}>{value}</p>
        </div>
        <div className={`${bgColor} rounded-lg p-2`}>{icon}</div>
      </div>
      <div className={`mt-3 h-1 rounded-full ${bgColor} opacity-60`} />
    </div>
  );
};

export default MetricCard;
