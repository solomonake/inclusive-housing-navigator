'use client';

import React, { useState, useEffect } from 'react';
import { CostBreakdownPie } from '@/components/charts/CostBreakdownPie';
import { PriceVsDistanceScatter } from '@/components/charts/PriceVsDistanceScatter';
import { CommuteHistogram } from '@/components/charts/CommuteHistogram';
import { Listing } from '@/types';

interface ChartConfig {
  type: string;
  data: any[];
  options: {
    title: string;
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
    legend?: boolean;
    responsive?: boolean;
  };
  justification: string;
}

export default function ChartsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      if (data.success) {
        setListings(data.data.data);
        generateCharts(data.data.data);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCharts = async (listingsData: Listing[]) => {
    try {
      const response = await fetch('/api/autoviz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: JSON.stringify(listingsData),
          analysis_type: 'distribution',
          focus_metrics: ['rent', 'di_score'],
          user_context: 'housing analysis'
        })
      });

      const data = await response.json();
      if (data.success) {
        setCharts(data.data.recommendations || []);
      }
    } catch (error) {
      console.error('Error generating charts:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bg))]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--accent))] mx-auto"></div>
            <p className="mt-4 text-[hsl(var(--fg-muted))]">Generating visualizations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--fg))] mb-2">
            Auto Visualization
          </h1>
          <p className="text-[hsl(var(--fg-muted))]">
            AI-powered charts and insights from your housing data
          </p>
        </div>

        <div className="space-y-8">
          {/* Sample Charts */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Sample Visualizations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings.length > 0 && (
                <>
                  <CostBreakdownPie 
                    data={{
                      rent: listings[0].rent,
                      utilities: listings[0].avg_utils,
                      deposit: listings[0].deposit,
                      fees: listings[0].fees
                    }}
                  />
                  <PriceVsDistanceScatter listings={listings.slice(0, 10)} />
                </>
              )}
            </div>
            <div className="mt-6">
              <CommuteHistogram listings={listings} />
            </div>
          </div>

          {/* AI-Generated Charts */}
          {charts.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">AI-Generated Insights</h2>
              <div className="space-y-6">
                {charts.map((chart, index) => (
                  <div key={index} className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">{chart.options.title}</h3>
                    <div className="h-64 bg-[hsl(var(--muted))] rounded-lg flex items-center justify-center">
                      <p className="text-[hsl(var(--fg-muted))]">
                        {chart.type} chart would be rendered here
                      </p>
                    </div>
                    <p className="text-sm text-[hsl(var(--fg-muted))] mt-4">
                      <strong>Why this chart:</strong> {chart.justification}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart Recommendations */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Chart Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                <h4 className="font-semibold mb-2">📊 Distribution Analysis</h4>
                <p className="text-sm text-[hsl(var(--fg-muted))]">
                  Bar charts and histograms to show how properties are distributed across price ranges, distances, and D&I scores.
                </p>
              </div>
              
              <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                <h4 className="font-semibold mb-2">🔗 Correlation Analysis</h4>
                <p className="text-sm text-[hsl(var(--fg-muted))]">
                  Scatter plots to reveal relationships between rent, distance, and accessibility features.
                </p>
              </div>
              
              <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                <h4 className="font-semibold mb-2">📈 Trend Analysis</h4>
                <p className="text-sm text-[hsl(var(--fg-muted))]">
                  Line charts to track how housing costs and availability change over time.
                </p>
              </div>
              
              <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                <h4 className="font-semibold mb-2">🥧 Cost Breakdown</h4>
                <p className="text-sm text-[hsl(var(--fg-muted))]">
                  Pie charts to visualize how monthly costs are distributed between rent, utilities, and fees.
                </p>
              </div>
              
              <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                <h4 className="font-semibold mb-2">🗺️ Geographic Analysis</h4>
                <p className="text-sm text-[hsl(var(--fg-muted))]">
                  Maps and heat maps to show property locations and neighborhood characteristics.
                </p>
              </div>
              
              <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                <h4 className="font-semibold mb-2">⚖️ Comparison Analysis</h4>
                <p className="text-sm text-[hsl(var(--fg-muted))]">
                  Radar charts and comparison tables to evaluate multiple properties side by side.
                </p>
              </div>
            </div>
          </div>

          {/* Data Insights */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Data Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[hsl(var(--accent))] mb-2">
                  {listings.length}
                </div>
                <div className="text-sm text-[hsl(var(--fg-muted))]">Total Properties</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[hsl(var(--positive))] mb-2">
                  {listings.length > 0 ? Math.round(listings.reduce((sum, l) => sum + l.di_score, 0) / listings.length) : 0}
                </div>
                <div className="text-sm text-[hsl(var(--fg-muted))]">Average D&I Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[hsl(var(--warning))] mb-2">
                  ${listings.length > 0 ? Math.round(listings.reduce((sum, l) => sum + l.rent, 0) / listings.length) : 0}
                </div>
                <div className="text-sm text-[hsl(var(--fg-muted))]">Average Rent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
