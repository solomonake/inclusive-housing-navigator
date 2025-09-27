'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Listing } from '@/types';

interface CommuteHistogramProps {
  listings: Listing[];
  className?: string;
}

export const CommuteHistogram: React.FC<CommuteHistogramProps> = ({ 
  listings, 
  className = '' 
}) => {
  // Create histogram data for walk times
  const walkTimeRanges = [
    { range: '0-5 min', count: 0, min: 0, max: 5 },
    { range: '6-10 min', count: 0, min: 6, max: 10 },
    { range: '11-15 min', count: 0, min: 11, max: 15 },
    { range: '16-20 min', count: 0, min: 16, max: 20 },
    { range: '21+ min', count: 0, min: 21, max: 999 }
  ];

  listings.forEach(listing => {
    const walkTime = listing.walk_min || 0;
    const range = walkTimeRanges.find(r => walkTime >= r.min && walkTime <= r.max);
    if (range) {
      range.count++;
    }
  });

  if (listings.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">Commute Time Distribution</h3>
        <p className="text-[hsl(var(--fg-muted))]">No data available for visualization.</p>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Commute Time Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={walkTimeRanges}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="range" 
              label={{ value: 'Walk Time Range', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Number of Properties', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} properties`, 'Count']}
              labelFormatter={(label) => `Walk Time: ${label}`}
            />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-[hsl(var(--fg-muted))] mt-4" aria-describedby="histogram-chart">
        This histogram shows the distribution of walk times to campus across all properties. 
        Most properties are within a 15-minute walk.
      </p>
    </div>
  );
};
