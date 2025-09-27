import { ChartConfig, AutoVizRequest } from '@/types';

export class AutoVisualizationService {
  /**
   * Generate chart configuration based on dataset and analysis type
   */
  generateChartConfig(request: AutoVizRequest): ChartConfig {
    const { dataset, analysis_type, focus_metrics, user_context } = request;

    switch (analysis_type) {
      case 'distribution':
        return this.generateDistributionChart(dataset, focus_metrics, user_context);
      case 'correlation':
        return this.generateCorrelationChart(dataset, focus_metrics, user_context);
      case 'trends':
        return this.generateTrendsChart(dataset, focus_metrics, user_context);
      case 'comparison':
        return this.generateComparisonChart(dataset, focus_metrics, user_context);
      default:
        return this.generateDefaultChart(dataset, focus_metrics, user_context);
    }
  }

  private generateDistributionChart(dataset: string, focus_metrics: string[], user_context: string): ChartConfig {
    // Parse dataset (assuming it's JSON string of housing listings)
    let data: any[] = [];
    try {
      data = JSON.parse(dataset);
    } catch {
      data = [];
    }

    // Generate distribution data based on focus metrics
    const distributionData = this.calculateDistribution(data, focus_metrics[0] || 'rent');

    return {
      type: 'bar',
      data: distributionData,
      options: {
        title: `Distribution of ${focus_metrics[0] || 'Rent'} in Housing Listings`,
        xAxis: focus_metrics[0] || 'Rent Range',
        yAxis: 'Number of Listings',
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
        legend: true,
        responsive: true
      },
      justification: `This bar chart shows the distribution of ${focus_metrics[0] || 'rent'} across housing listings, helping you understand the price range and availability in your search area.`
    };
  }

  private generateCorrelationChart(dataset: string, focus_metrics: string[], user_context: string): ChartConfig {
    let data: any[] = [];
    try {
      data = JSON.parse(dataset);
    } catch {
      data = [];
    }

    const correlationData = this.calculateCorrelation(data, focus_metrics);

    return {
      type: 'scatter',
      data: correlationData,
      options: {
        title: `Correlation: ${focus_metrics[0] || 'Rent'} vs ${focus_metrics[1] || 'D&I Score'}`,
        xAxis: focus_metrics[0] || 'Rent',
        yAxis: focus_metrics[1] || 'D&I Score',
        colors: ['#3B82F6'],
        legend: false,
        responsive: true
      },
      justification: `This scatter plot reveals the relationship between ${focus_metrics[0] || 'rent'} and ${focus_metrics[1] || 'D&I score'}, showing whether higher-priced listings offer better accessibility and inclusivity features.`
    };
  }

  private generateTrendsChart(dataset: string, focus_metrics: string[], user_context: string): ChartConfig {
    let data: any[] = [];
    try {
      data = JSON.parse(dataset);
    } catch {
      data = [];
    }

    const trendsData = this.calculateTrends(data, focus_metrics[0] || 'rent');

    return {
      type: 'line',
      data: trendsData,
      options: {
        title: `Trends in ${focus_metrics[0] || 'Rent'} Over Time`,
        xAxis: 'Time Period',
        yAxis: focus_metrics[0] || 'Average Rent',
        colors: ['#3B82F6', '#10B981'],
        legend: true,
        responsive: true
      },
      justification: `This line chart tracks trends in ${focus_metrics[0] || 'rent'} over time, helping you understand market dynamics and make informed decisions about when to rent.`
    };
  }

  private generateComparisonChart(dataset: string, focus_metrics: string[], user_context: string): ChartConfig {
    let data: any[] = [];
    try {
      data = JSON.parse(dataset);
    } catch {
      data = [];
    }

    const comparisonData = this.calculateComparison(data, focus_metrics);

    return {
      type: 'radar',
      data: comparisonData,
      options: {
        title: `Comparison of Housing Features`,
        colors: ['#3B82F6', '#10B981', '#F59E0B'],
        legend: true,
        responsive: true
      },
      justification: `This radar chart compares multiple housing features simultaneously, giving you a comprehensive view of how different listings perform across various criteria.`
    };
  }

  private generateDefaultChart(dataset: string, focus_metrics: string[], user_context: string): ChartConfig {
    return {
      type: 'bar',
      data: [{ name: 'Sample', value: 100 }],
      options: {
        title: 'Housing Data Overview',
        xAxis: 'Category',
        yAxis: 'Value',
        colors: ['#3B82F6'],
        legend: true,
        responsive: true
      },
      justification: 'This chart provides a general overview of your housing data to help you understand the available options.'
    };
  }

  private calculateDistribution(data: any[], metric: string): any[] {
    if (data.length === 0) return [];

    const values = data.map(item => item[metric] || 0).filter(val => !isNaN(val));
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const bucketSize = range / 5; // 5 buckets

    const buckets = [];
    for (let i = 0; i < 5; i++) {
      const bucketMin = min + i * bucketSize;
      const bucketMax = min + (i + 1) * bucketSize;
      const count = values.filter(val => val >= bucketMin && val < bucketMax).length;
      
      buckets.push({
        name: `$${Math.round(bucketMin)}-$${Math.round(bucketMax)}`,
        value: count
      });
    }

    return buckets;
  }

  private calculateCorrelation(data: any[], metrics: string[]): any[] {
    if (data.length === 0 || metrics.length < 2) return [];

    return data.map(item => ({
      x: item[metrics[0]] || 0,
      y: item[metrics[1]] || 0,
      name: item.name || `Listing ${item.id}`
    })).filter(point => !isNaN(point.x) && !isNaN(point.y));
  }

  private calculateTrends(data: any[], metric: string): any[] {
    if (data.length === 0) return [];

    // Simulate trends over time (in real app, this would use actual time series data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const values = data.map(item => item[metric] || 0).filter(val => !isNaN(val));
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;

    return months.map((month, index) => ({
      name: month,
      value: avgValue + (Math.random() - 0.5) * avgValue * 0.2 // Add some variation
    }));
  }

  private calculateComparison(data: any[], metrics: string[]): any[] {
    if (data.length === 0) return [];

    const topListings = data.slice(0, 3); // Top 3 listings
    
    return topListings.map((listing, index) => ({
      name: listing.name || `Listing ${index + 1}`,
      data: metrics.map(metric => ({
        axis: metric,
        value: listing[metric] || 0
      }))
    }));
  }

  /**
   * Generate multiple chart recommendations for a dataset
   */
  generateChartRecommendations(dataset: string, user_context: string): ChartConfig[] {
    const recommendations: ChartConfig[] = [];

    // Distribution chart for rent
    recommendations.push(this.generateChartConfig({
      dataset,
      analysis_type: 'distribution',
      focus_metrics: ['rent'],
      user_context
    }));

    // Correlation chart for rent vs D&I score
    recommendations.push(this.generateChartConfig({
      dataset,
      analysis_type: 'correlation',
      focus_metrics: ['rent', 'di_score'],
      user_context
    }));

    // Comparison chart for top listings
    recommendations.push(this.generateChartConfig({
      dataset,
      analysis_type: 'comparison',
      focus_metrics: ['affordability', 'accessibility', 'safety', 'commute', 'inclusivity'],
      user_context
    }));

    return recommendations;
  }
}
