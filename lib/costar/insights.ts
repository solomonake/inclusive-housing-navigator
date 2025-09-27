import { Listing, CoStarInsights } from '@/types';

export class CoStarInsightsService {
  /**
   * Generate market statistics for a listing
   */
  static generateMarketStats(listing: Listing, marketData?: any): {
    avg_rent: number;
    price_trend: 'increasing' | 'decreasing' | 'stable';
    vacancy_rate: number;
    cap_rate: number;
  } {
    // In a real implementation, this would connect to CoStar's API
    // For demo purposes, we'll generate realistic mock data
    
    const avgRent = listing.rent * (0.9 + Math.random() * 0.2); // ±10% variation
    const priceTrend = Math.random() > 0.5 ? 'increasing' : Math.random() > 0.3 ? 'stable' : 'decreasing';
    const vacancyRate = Math.random() * 0.15; // 0-15% vacancy
    const capRate = 0.04 + Math.random() * 0.04; // 4-8% cap rate

    return {
      avg_rent: Math.round(avgRent),
      price_trend: priceTrend,
      vacancy_rate: Math.round(vacancyRate * 100) / 100,
      cap_rate: Math.round(capRate * 100) / 100
    };
  }

  /**
   * Analyze neighborhood characteristics
   */
  static analyzeNeighborhood(listing: Listing): {
    walkability: number;
    transit_score: number;
    safety_score: number;
    amenities_score: number;
  } {
    // Use existing data from the listing
    return {
      walkability: listing.walkability_score,
      transit_score: listing.transit_score,
      safety_score: listing.neighborhood_safety_score,
      amenities_score: Math.round((listing.amenities.length / 10) * 100) // Scale amenities to 0-100
    };
  }

  /**
   * Calculate investment metrics
   */
  static calculateInvestmentMetrics(listing: Listing, marketStats: any): {
    roi_potential: 'High' | 'Medium' | 'Low';
    appreciation_rate: number;
    rental_yield: number;
  } {
    const rentalYield = (listing.rent * 12) / (listing.rent * 200); // Simplified calculation
    const appreciationRate = marketStats.price_trend === 'increasing' ? 0.03 + Math.random() * 0.02 : 
                           marketStats.price_trend === 'stable' ? 0.01 + Math.random() * 0.01 : 
                           -0.01 - Math.random() * 0.02;
    
    let roiPotential: 'High' | 'Medium' | 'Low';
    if (rentalYield > 0.08 && appreciationRate > 0.03) {
      roiPotential = 'High';
    } else if (rentalYield > 0.05 && appreciationRate > 0.01) {
      roiPotential = 'Medium';
    } else {
      roiPotential = 'Low';
    }

    return {
      roi_potential: roiPotential,
      appreciation_rate: Math.round(appreciationRate * 100) / 100,
      rental_yield: Math.round(rentalYield * 100) / 100
    };
  }

  /**
   * Generate comprehensive CoStar insights
   */
  static generateInsights(listing: Listing): CoStarInsights {
    const marketStats = this.generateMarketStats(listing);
    const neighborhood = this.analyzeNeighborhood(listing);
    const investment = this.calculateInvestmentMetrics(listing, marketStats);

    return {
      market_stats: marketStats,
      neighborhood_analysis: neighborhood,
      investment_metrics: investment
    };
  }

  /**
   * Compare listing to market benchmarks
   */
  static compareToMarket(listing: Listing, marketStats: any): {
    rent_vs_market: number; // Percentage above/below market
    value_score: number; // 0-100 score
    market_position: 'Above Market' | 'At Market' | 'Below Market';
  } {
    const rentVsMarket = ((listing.rent - marketStats.avg_rent) / marketStats.avg_rent) * 100;
    const valueScore = Math.max(0, 100 - Math.abs(rentVsMarket));
    
    let marketPosition: 'Above Market' | 'At Market' | 'Below Market';
    if (rentVsMarket > 10) {
      marketPosition = 'Above Market';
    } else if (rentVsMarket < -10) {
      marketPosition = 'Below Market';
    } else {
      marketPosition = 'At Market';
    }

    return {
      rent_vs_market: Math.round(rentVsMarket * 100) / 100,
      value_score: Math.round(valueScore),
      market_position: marketPosition
    };
  }

  /**
   * Generate market trends analysis
   */
  static generateMarketTrends(listing: Listing): {
    rent_growth_forecast: number;
    demand_indicators: string[];
    risk_factors: string[];
  } {
    const rentGrowthForecast = Math.random() * 0.1 - 0.05; // -5% to +5%
    
    const demandIndicators = [];
    if (listing.distance_to_campus < 1.0) {
      demandIndicators.push('Close to campus - high student demand');
    }
    if (listing.transit_score > 80) {
      demandIndicators.push('Excellent transit access');
    }
    if (listing.walkability_score > 85) {
      demandIndicators.push('Highly walkable neighborhood');
    }
    if (listing.amenities.length > 5) {
      demandIndicators.push('Rich amenities package');
    }

    const riskFactors = [];
    if (listing.distance_to_campus > 2.0) {
      riskFactors.push('Far from campus - limited student demand');
    }
    if (listing.transit_score < 50) {
      riskFactors.push('Poor transit access');
    }
    if (listing.neighborhood_safety_score < 70) {
      riskFactors.push('Safety concerns in neighborhood');
    }
    if (listing.rent > 1500) {
      riskFactors.push('High rent may limit demand');
    }

    return {
      rent_growth_forecast: Math.round(rentGrowthForecast * 100) / 100,
      demand_indicators: demandIndicators,
      risk_factors: riskFactors
    };
  }

  /**
   * Generate investment recommendations
   */
  static generateInvestmentRecommendations(insights: CoStarInsights): string[] {
    const recommendations = [];

    if (insights.investment_metrics.roi_potential === 'High') {
      recommendations.push('🎯 Strong investment potential - consider this property');
    } else if (insights.investment_metrics.roi_potential === 'Medium') {
      recommendations.push('⚖️ Moderate investment potential - evaluate carefully');
    } else {
      recommendations.push('⚠️ Limited investment potential - consider alternatives');
    }

    if (insights.market_stats.price_trend === 'increasing') {
      recommendations.push('📈 Market is appreciating - good time to invest');
    } else if (insights.market_stats.price_trend === 'decreasing') {
      recommendations.push('📉 Market is declining - consider waiting or negotiating');
    }

    if (insights.market_stats.vacancy_rate < 0.05) {
      recommendations.push('🏠 Low vacancy rate - high demand area');
    } else if (insights.market_stats.vacancy_rate > 0.10) {
      recommendations.push('🏘️ High vacancy rate - may indicate oversupply');
    }

    if (insights.neighborhood_analysis.walkability > 80) {
      recommendations.push('🚶 High walkability score - desirable location');
    }

    if (insights.neighborhood_analysis.safety_score > 85) {
      recommendations.push('🛡️ Safe neighborhood - good for long-term investment');
    }

    return recommendations;
  }
}
