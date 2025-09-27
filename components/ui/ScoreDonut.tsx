'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreDonutProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const ScoreDonut: React.FC<ScoreDonutProps> = ({
  score,
  size = 'md',
  className,
  showPercentage = true,
  animated = true
}) => {
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
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-amber-500';
    if (score >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500/20';
    if (score >= 60) return 'stroke-amber-500/20';
    if (score >= 40) return 'stroke-orange-500/20';
    return 'stroke-red-500/20';
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg
        className="transform -rotate-90"
        width={size === 'sm' ? 64 : size === 'md' ? 96 : 128}
        height={size === 'sm' ? 64 : size === 'md' ? 96 : 128}
      >
        {/* Background circle */}
        <circle
          cx={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          cy={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={getScoreBgColor(score)}
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
            getScoreColor(score),
            animated && 'motion-safe:transition-all motion-safe:duration-1000 motion-safe:ease-out'
          )}
          style={{
            strokeDasharray,
            strokeDashoffset: animated ? strokeDashoffset : circumference - (score / 100) * circumference
          }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn('font-bold text-white', textSizeClasses[size])}>
            {Math.round(score)}
          </div>
          {showPercentage && (
            <div className={cn('text-white/60', textSizeClasses[size])}>
              %
            </div>
          )}
        </div>
      </div>
    </div>
  );
};