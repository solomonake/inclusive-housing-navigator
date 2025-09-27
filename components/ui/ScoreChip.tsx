'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ScoreType = 'affordability' | 'accessibility' | 'safety' | 'commute' | 'inclusivity';

interface ScoreChipProps {
  type: ScoreType;
  score: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreChip: React.FC<ScoreChipProps> = ({
  type,
  score,
  className,
  showLabel = true,
  size = 'md'
}) => {
  const getTypeConfig = (type: ScoreType) => {
    const configs = {
      affordability: {
        label: 'Affordability',
        icon: '💰',
        colorClass: 'score-chip-affordability',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-800',
        borderColor: 'border-indigo-200'
      },
      accessibility: {
        label: 'Accessibility',
        icon: '♿',
        colorClass: 'score-chip-accessibility',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200'
      },
      safety: {
        label: 'Safety',
        icon: '🛡️',
        colorClass: 'score-chip-safety',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200'
      },
      commute: {
        label: 'Commute',
        icon: '🚌',
        colorClass: 'score-chip-commute',
        bgColor: 'bg-sky-100',
        textColor: 'text-sky-800',
        borderColor: 'border-sky-200'
      },
      inclusivity: {
        label: 'Inclusivity',
        icon: '🤝',
        colorClass: 'score-chip-inclusivity',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200'
      }
    };
    return configs[type];
  };

  const getSizeClasses = (size: string) => {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm'
    };
    return sizes[size as keyof typeof sizes] || sizes.md;
  };

  const config = getTypeConfig(type);
  const sizeClasses = getSizeClasses(size);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    if (score >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-all duration-200 hover:scale-105 motion-safe:transition-all',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses,
        className
      )}
    >
      <span className="mr-1.5 text-xs">{config.icon}</span>
      {showLabel && (
        <span className="mr-1.5 font-medium">{config.label}:</span>
      )}
      <span className={cn('font-bold', getScoreColor(score))}>
        {Math.round(score)}
      </span>
    </div>
  );
};