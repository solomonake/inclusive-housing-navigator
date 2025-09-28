'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ScoreType = 'affordability' | 'accessibility' | 'safety' | 'commute' | 'inclusivity';

interface ScoreChipProps {
  type: ScoreType;
  score: number;
  label?: string;
  value?: number;
  variant?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreChip: React.FC<ScoreChipProps> = ({
  type,
  score,
  label,
  value,
  variant,
  className,
  showLabel = true,
  size = 'md'
}) => {
  const getTypeConfig = (type: ScoreType) => {
    const configs = {
      affordability: {
        label: 'Affordability',
        icon: '💰',
        colorClass: 'chip-affordability',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-300',
        borderColor: 'border-emerald-500/20'
      },
      accessibility: {
        label: 'Accessibility',
        icon: '♿',
        colorClass: 'chip-accessibility',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-300',
        borderColor: 'border-blue-500/20'
      },
      safety: {
        label: 'Safety',
        icon: '🛡️',
        colorClass: 'chip-safety',
        bgColor: 'bg-amber-500/10',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-500/20'
      },
      commute: {
        label: 'Commute',
        icon: '🚌',
        colorClass: 'chip-commute',
        bgColor: 'bg-sky-500/10',
        textColor: 'text-sky-300',
        borderColor: 'border-sky-500/20'
      },
      inclusivity: {
        label: 'Inclusivity',
        icon: '🤝',
        colorClass: 'chip-inclusivity',
        bgColor: 'bg-purple-500/10',
        textColor: 'text-purple-300',
        borderColor: 'border-purple-500/20'
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
  const displayScore = value !== undefined ? value : score;
  const displayLabel = label || config.label;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-200';
    if (score >= 60) return 'text-amber-200';
    if (score >= 40) return 'text-orange-200';
    return 'text-red-200';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-all duration-200 hover:scale-105',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses,
        className
      )}
      aria-label={`${displayLabel}: ${displayScore} out of 100`}
    >
      <span className="mr-1.5 text-xs">{config.icon}</span>
      {showLabel && (
        <span className="mr-1.5 font-medium">{displayLabel}:</span>
      )}
      <span className={cn('font-bold', getScoreColor(displayScore))}>
        {Math.round(displayScore)}
      </span>
    </div>
  );
};