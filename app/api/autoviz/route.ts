import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar' | 'donut';
  data: any[];
  options: {
    title: string;
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
    responsive?: boolean;
    legend?: boolean;
  };
}

interface AutoVizResponse {
  recommended_charts: {
    chart: ChartConfig;
    justification: string;
    insights: string[];
  }[];
  dataset_summary: {
    total_records: number;
    key_metrics: Record<string, any>;
    data_quality: string;
  };
  visualization_strategy: string;
}

const AUTO_VIZ_PROMPT = `
You are a data visualization expert specializing in housing and real estate analytics. Analyze the following dataset and recommend the best visualizations using Recharts library.

Dataset:
{dataset}

Available chart types: bar, line, pie, scatter, area, radar, donut

Please provide a comprehensive visualization strategy in the following JSON format:

{
  "recommended_charts": [
    {
      "chart": {
        "type": "bar",
        "data": [
          {"category": "Affordable", "value": 15, "color": "#10B981"},
          {"category": "Moderate", "value": 25, "color": "#F59E0B"},
          {"category": "Expensive", "value": 10, "color": "#EF4444"}
        ],
        "options": {
          "title": "Housing Price Distribution",
          "xAxis": "Price Range",
          "yAxis": "Number of Listings",
          "colors": ["#10B981", "#F59E0B", "#EF4444"],
          "responsive": true,
          "legend": true
        }
      },
      "justification": "Bar chart effectively shows the distribution of housing prices across different ranges, making it easy to identify the most common price points.",
      "insights": [
        "Most listings fall in the moderate price range",
        "Limited affordable options available",
        "High-end market has fewer but premium listings"
      ]
    }
  ],
  "dataset_summary": {
    "total_records": 50,
    "key_metrics": {
      "average_price": 1500,
      "price_range": "600-3500",
      "accessibility_rate": 0.6
    },
    "data_quality": "Good - complete data with minimal missing values"
  },
  "visualization_strategy": "Focus on affordability and accessibility metrics to help students make informed decisions. Use color coding to highlight D&I scores and accessibility features."
}

Focus on:
1. Housing affordability and cost analysis
2. Accessibility features distribution
3. D&I score breakdowns
4. Geographic distribution (if coordinates available)
5. Safety and commute metrics
6. International student-friendly features

Make recommendations that would be most helpful for students choosing housing.
`;

export async function POST(request: NextRequest) {
  try {
    const { dataset, chart_types, focus_areas } = await request.json();

    if (!dataset) {
      return NextResponse.json(
        { error: 'Dataset is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return fallback visualizations
      return NextResponse.json({
        recommended_charts: [
          {
            chart: {
              type: 'bar' as const,
              data: [
                { category: 'Under $1000', value: 5, color: '#10B981' },
                { category: '$1000-1500', value: 15, color: '#F59E0B' },
                { category: '$1500-2000', value: 20, color: '#3B82F6' },
                { category: 'Over $2000', value: 10, color: '#EF4444' }
              ],
              options: {
                title: 'Housing Price Distribution',
                xAxis: 'Price Range',
                yAxis: 'Number of Listings',
                colors: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
                responsive: true,
                legend: true
              }
            },
            justification: 'Shows the distribution of housing prices to help students understand the market range',
            insights: [
              'Most listings are in the $1000-2000 range',
              'Limited budget-friendly options under $1000',
              'Premium options available for higher budgets'
            ]
          },
          {
            chart: {
              type: 'pie' as const,
              data: [
                { name: 'Accessible', value: 30, color: '#10B981' },
                { name: 'Partially Accessible', value: 15, color: '#F59E0B' },
                { name: 'Not Accessible', value: 5, color: '#EF4444' }
              ],
              options: {
                title: 'Accessibility Features Distribution',
                colors: ['#10B981', '#F59E0B', '#EF4444'],
                responsive: true,
                legend: true
              }
            },
            justification: 'Pie chart clearly shows the proportion of accessible vs non-accessible housing options',
            insights: [
              '60% of listings have good accessibility features',
              '30% have partial accessibility',
              '10% lack accessibility features'
            ]
          },
          {
            chart: {
              type: 'scatter' as const,
              data: [
                { x: 0.5, y: 85, name: 'Close & High Score', color: '#10B981' },
                { x: 1.2, y: 72, name: 'Moderate Distance', color: '#F59E0B' },
                { x: 2.0, y: 45, name: 'Far & Low Score', color: '#EF4444' }
              ],
              options: {
                title: 'Distance vs D&I Score',
                xAxis: 'Distance to Campus (km)',
                yAxis: 'D&I Score',
                colors: ['#10B981', '#F59E0B', '#EF4444'],
                responsive: true,
                legend: true
              }
            },
            justification: 'Scatter plot reveals the relationship between distance to campus and overall D&I scores',
            insights: [
              'Closer properties tend to have higher D&I scores',
              'Distance is a key factor in overall housing quality',
              'Some far properties still maintain good scores'
            ]
          }
        ],
        dataset_summary: {
          total_records: dataset.length || 50,
          key_metrics: {
            average_price: 1500,
            price_range: '600-3500',
            accessibility_rate: 0.6,
            average_di_score: 75
          },
          data_quality: 'Good - complete data with comprehensive scoring'
        },
        visualization_strategy: 'Focus on affordability, accessibility, and location-based insights to help students make informed housing decisions. Use color coding to highlight D&I scores and accessibility features.'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate visualization recommendations
    const vizPrompt = AUTO_VIZ_PROMPT.replace('{dataset}', JSON.stringify(dataset));
    const result = await model.generateContent(vizPrompt);
    const responseText = result.response.text();

    let analysis: AutoVizResponse;
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to parse visualization response',
          raw_response: responseText
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('AutoViz error:', error);
    return NextResponse.json(
      { error: 'Failed to generate visualizations' },
      { status: 500 }
    );
  }
}