'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreDonutProps {
  value?: number;
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const ScoreDonut: React.FC<ScoreDonutProps> = ({
  value,
  score,
  label,
  size = 'md',
  colorClass,
  className,
  showPercentage = true,
  animated = true
}) => {
  const displayScore = value !== undefined ? value : score || 0;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 6;
  const radius = size === 'sm' ? 26 : size === 'md' ? 38 : 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-400';
    if (score >= 60) return 'stroke-amber-400';
    if (score >= 40) return 'stroke-orange-400';
    return 'stroke-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-400/20';
    if (score >= 60) return 'stroke-amber-400/20';
    if (score >= 40) return 'stroke-orange-400/20';
    return 'stroke-red-400/20';
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg
        className="transform -rotate-90"
        width={size === 'sm' ? 64 : size === 'md' ? 96 : 128}
        height={size === 'sm' ? 64 : size === 'md' ? 96 : 128}
        aria-label={`${label || 'Score'}: ${displayScore} out of 100`}
      >
        {/* Background circle */}
        <circle
          cx={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          cy={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={getScoreBgColor(displayScore)}
        />
        {/* Progress circle */}
        <circle
          cx={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          cy={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            colorClass || getScoreColor(displayScore),
            animated && 'motion-safe:transition-all motion-safe:duration-1000 motion-safe:ease-out'
          )}
          style={{
            strokeDasharray,
            strokeDashoffset: animated ? strokeDashoffset : circumference - (displayScore / 100) * circumference
          }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn('font-bold text-white', textSizeClasses[size])}>
            {Math.round(displayScore)}
          </div>
          {showPercentage && (
            <div className={cn('text-white/60', textSizeClasses[size])}>
              {size !== 'sm' && '%'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};