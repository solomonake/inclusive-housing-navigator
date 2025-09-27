import { NextRequest, NextResponse } from 'next/server';
import { CoStarInsightsService } from '@/lib/costar/insights';
import { Listing } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      listing, 
      analysis_type = 'full' 
    }: { 
      listing: Listing; 
      analysis_type?: 'full' | 'market' | 'neighborhood' | 'investment';
    } = body;

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: listing' },
        { status: 400 }
      );
    }

    let insights;

    switch (analysis_type) {
      case 'market':
        insights = {
          market_stats: CoStarInsightsService.generateMarketStats(listing),
          market_comparison: CoStarInsightsService.compareToMarket(listing, {}),
          market_trends: CoStarInsightsService.generateMarketTrends(listing)
        };
        break;
      
      case 'neighborhood':
        insights = {
          neighborhood_analysis: CoStarInsightsService.analyzeNeighborhood(listing),
          market_trends: CoStarInsightsService.generateMarketTrends(listing)
        };
        break;
      
      case 'investment':
        const marketStats = CoStarInsightsService.generateMarketStats(listing);
        insights = {
          investment_metrics: CoStarInsightsService.calculateInvestmentMetrics(listing, marketStats),
          market_comparison: CoStarInsightsService.compareToMarket(listing, marketStats),
          recommendations: CoStarInsightsService.generateInvestmentRecommendations({
            market_stats: marketStats,
            neighborhood_analysis: CoStarInsightsService.analyzeNeighborhood(listing),
            investment_metrics: CoStarInsightsService.calculateInvestmentMetrics(listing, marketStats)
          })
        };
        break;
      
      case 'full':
      default:
        insights = CoStarInsightsService.generateInsights(listing);
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        insights,
        analysis_type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating CoStar insights:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate CoStar insights' },
      { status: 500 }
    );
  }
}
