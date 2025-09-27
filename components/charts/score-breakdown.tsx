'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DIScore } from '@/types';
import { cn, formatScore, getScoreColor, getScoreBgColor, getTierColor } from '@/lib/utils';

interface ScoreBreakdownProps {
  score: DIScore;
  showDetails?: boolean;
  className?: string;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ 
  score, 
  showDetails = true,
  className 
}) => {
  const scoreComponents = [
    {
      name: 'Affordability',
      score: score.affordability,
      weight: '35%',
      rationale: score.rationale.affordability,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Accessibility',
      score: score.accessibility,
      weight: '20%',
      rationale: score.rationale.accessibility,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Safety',
      score: score.safety,
      weight: '20%',
      rationale: score.rationale.safety,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Commute',
      score: score.commute,
      weight: '15%',
      rationale: score.rationale.commute,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Inclusivity',
      score: score.inclusivity,
      weight: '10%',
      rationale: score.rationale.inclusivity,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">D&I Score Breakdown</CardTitle>
            <CardDescription>
              Diversity & Inclusion scoring based on weighted criteria
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" style={{ color: getScoreColor(score.overall) }}>
              {formatScore(score.overall)}
            </div>
            <Badge className={cn('mt-2', getTierColor(score.tier))}>
              {score.tier}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Overall Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Score</span>
              <span className="font-medium">{formatScore(score.overall)}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn('h-3 rounded-full transition-all duration-500', getScoreBgColor(score.overall))}
                style={{ width: `${Math.min(100, Math.max(0, score.overall))}%` }}
                role="progressbar"
                aria-valuenow={score.overall}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Overall D&I score: ${formatScore(score.overall)}`}
              />
            </div>
          </div>

          {/* Component Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreComponents.map((component) => (
              <div key={component.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{component.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={cn('text-sm font-bold', component.color)}>
                      {formatScore(component.score)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {component.weight}
                    </Badge>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={cn('h-2 rounded-full transition-all duration-500', component.bgColor)}
                    style={{ width: `${Math.min(100, Math.max(0, component.score))}%` }}
                    role="progressbar"
                    aria-valuenow={component.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${component.name} score: ${formatScore(component.score)}`}
                  />
                </div>

                {showDetails && (
                  <p className="text-xs text-gray-600 mt-1">
                    {component.rationale}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Breakdown */}
          {showDetails && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Detailed Breakdown</h4>
              <p className="text-sm text-gray-600">{score.breakdown}</p>
            </div>
          )}

          {/* Rationale Details */}
          {showDetails && (
            <div className="mt-4 space-y-3">
              <h4 className="font-medium text-sm">Score Rationale</h4>
              <div className="space-y-2">
                {scoreComponents.map((component) => (
                  <div key={component.name} className="text-sm">
                    <span className="font-medium text-gray-700">{component.name}:</span>
                    <span className="ml-2 text-gray-600">{component.rationale}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
