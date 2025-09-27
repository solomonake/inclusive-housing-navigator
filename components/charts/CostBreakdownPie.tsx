'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CostBreakdownPieProps {
  data: {
    rent: number;
    utilities: number;
    deposit: number;
    fees: number;
  };
  className?: string;
}

export const CostBreakdownPie: React.FC<CostBreakdownPieProps> = ({ 
  data, 
  className = '' 
}) => {
  const chartData = [
    { name: 'Rent', value: data.rent, color: '#3B82F6' },
    { name: 'Utilities', value: data.utilities, color: '#10B981' },
    { name: 'Deposit (prorated)', value: data.deposit / 12, color: '#F59E0B' },
    { name: 'Fees', value: data.fees, color: '#EF4444' }
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`card p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Monthly Cost Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-[hsl(var(--fg-muted))] mt-4" aria-describedby="cost-breakdown">
        Total monthly cost: ${total.toLocaleString()}
      </p>
    </div>
  );
};
