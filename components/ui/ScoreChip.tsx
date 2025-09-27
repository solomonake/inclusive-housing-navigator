import React from 'react';

interface ScoreChipProps {
  label: string;
  value: number;
  variant: 'indigo' | 'emerald' | 'purple';
}

export const ScoreChip: React.FC<ScoreChipProps> = ({ label, value, variant }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'indigo':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVariantClasses()}`}
      role="img"
      aria-label={`${label}: ${value} out of 100`}
    >
      {label}: {value}
    </span>
  );
};