import { NextRequest, NextResponse } from 'next/server';
import { AutoVisualizationService } from '@/lib/visualization/autoviz';
import { AutoVizRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dataset, analysis_type, focus_metrics, user_context }: AutoVizRequest = body;

    if (!dataset) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: dataset' },
        { status: 400 }
      );
    }

    const autoVizService = new AutoVisualizationService();
    
    // Generate single chart configuration
    const chartConfig = autoVizService.generateChartConfig({
      dataset,
      analysis_type: analysis_type || 'distribution',
      focus_metrics: focus_metrics || ['rent'],
      user_context: user_context || 'housing analysis'
    });

    // Generate additional chart recommendations
    const recommendations = autoVizService.generateChartRecommendations(dataset, user_context || 'housing analysis');

    return NextResponse.json({
      success: true,
      data: {
        primary_chart: chartConfig,
        recommendations,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating auto-visualization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate visualization' },
      { status: 500 }
    );
  }
}
