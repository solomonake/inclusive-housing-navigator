'use client';

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Listing } from '@/types';

interface PriceVsDistanceScatterProps {
  listings: Listing[];
  className?: string;
}

export const PriceVsDistanceScatter: React.FC<PriceVsDistanceScatterProps> = ({ 
  listings, 
  className = '' 
}) => {
  const chartData = listings.map(listing => ({
    x: listing.dist_to_campus_km,
    y: listing.rent,
    di_score: listing.di_score,
    name: listing.title
  }));

  if (listings.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">Price vs Distance Analysis</h3>
        <p className="text-[hsl(var(--fg-muted))]">No data available for visualization.</p>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Price vs Distance Analysis</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Distance to Campus"
              unit="km"
              label={{ value: 'Distance to Campus (km)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Rent"
              unit="$"
              label={{ value: 'Monthly Rent ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'x') return [`${value} km`, 'Distance to Campus'];
                if (name === 'y') return [`$${value.toLocaleString()}`, 'Monthly Rent'];
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `Property: ${payload[0].payload.name}`;
                }
                return '';
              }}
            />
            <Scatter 
              data={chartData} 
              fill="#3B82F6"
              r={6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-[hsl(var(--fg-muted))] mt-4" aria-describedby="scatter-chart">
        This chart shows the relationship between distance to campus and monthly rent. 
        Properties closer to campus tend to be more expensive.
      </p>
    </div>
  );
};
