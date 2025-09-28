import { Listing, BudgetAnalysis, UserPreferences } from '@/types';

export class BudgetPlanner {
  /**
   * Calculate total monthly cost for a listing
   */
  static calculateTotalMonthlyCost(listing: Listing): number {
    return listing.rent + (listing.avg_utils || 0) + ((listing.deposit || 0) / 12);
  }

  /**
   * Calculate affordability ratio
   */
  static calculateAffordabilityRatio(totalCost: number, userBudget: number): number {
    return totalCost / userBudget;
  }

  /**
   * Generate deposit schedule
   */
  static generateDepositSchedule(listing: Listing): {
    first_month: number;
    last_month: number;
    security_deposit: number;
  } {
    const securityDeposit = listing.deposit || 0;
    const firstMonth = listing.rent + (listing.avg_utils || 0) + securityDeposit;
    const lastMonth = listing.rent + (listing.avg_utils || 0);

    return {
      first_month: firstMonth,
      last_month: lastMonth,
      security_deposit: securityDeposit
    };
  }

  /**
   * Generate what-if scenarios
   */
  static generateWhatIfScenarios(listing: Listing, userBudget: number): {
    scenario: string;
    impact: string;
    new_cost: number;
  }[] {
    const baseCost = this.calculateTotalMonthlyCost(listing);
    const scenarios = [];

    // Rent increase scenarios
    scenarios.push({
      scenario: 'Rent increases by 5% next year',
      impact: 'Monthly cost would increase by $' + (listing.rent * 0.05).toFixed(2),
      new_cost: baseCost + (listing.rent * 0.05)
    });

    scenarios.push({
      scenario: 'Rent increases by 10% next year',
      impact: 'Monthly cost would increase by $' + (listing.rent * 0.10).toFixed(2),
      new_cost: baseCost + (listing.rent * 0.10)
    });

    // Utilities increase scenarios
    scenarios.push({
      scenario: 'Utilities increase by 20%',
      impact: 'Monthly cost would increase by $' + ((listing.avg_utils || 0) * 0.20).toFixed(2),
      new_cost: baseCost + ((listing.avg_utils || 0) * 0.20)
    });

    scenarios.push({
      scenario: 'Utilities increase by 50%',
      impact: 'Monthly cost would increase by $' + ((listing.avg_utils || 0) * 0.50).toFixed(2),
      new_cost: baseCost + ((listing.avg_utils || 0) * 0.50)
    });

    // Combined scenarios
    scenarios.push({
      scenario: 'Both rent and utilities increase by 10%',
      impact: 'Monthly cost would increase by $' + ((listing.rent + (listing.avg_utils || 0)) * 0.10).toFixed(2),
      new_cost: baseCost + ((listing.rent + (listing.avg_utils || 0)) * 0.10)
    });

    // Emergency fund scenarios
    scenarios.push({
      scenario: 'Need 3-month emergency fund',
      impact: 'Should save $' + (baseCost * 3).toFixed(2) + ' for emergencies',
      new_cost: baseCost * 3
    });

    return scenarios;
  }

  /**
   * Generate budget recommendations
   */
  static generateBudgetRecommendations(
    listing: Listing, 
    userBudget: number,
    userPreferences: UserPreferences
  ): string[] {
    const totalCost = this.calculateTotalMonthlyCost(listing);
    const affordabilityRatio = this.calculateAffordabilityRatio(totalCost, userBudget);
    const recommendations: string[] = [];

    // Affordability recommendations
    if (affordabilityRatio > 0.5) {
      recommendations.push('⚠️ This housing exceeds 50% of your budget - consider more affordable options');
    } else if (affordabilityRatio > 0.3) {
      recommendations.push('⚠️ This housing uses 30-50% of your budget - ensure you have enough for other expenses');
    } else {
      recommendations.push('✅ This housing fits well within your budget');
    }

    // Emergency fund recommendations
    const emergencyFund = totalCost * 3;
    if (emergencyFund > userBudget * 0.5) {
      recommendations.push('💡 Consider building a 3-month emergency fund before moving in');
    }

    // Deposit recommendations
    if ((listing.deposit || 0) > userBudget * 2) {
      recommendations.push('💰 High deposit required - ensure you have sufficient savings');
    }

    // Utilities recommendations
    if (!listing.incl_utils) {
      recommendations.push('⚡ Utilities not included - budget for variable costs');
    }

    // Accessibility recommendations
    if (userPreferences.accessibility_needs.length > 0) {
      recommendations.push('♿ Consider accessibility modifications that may require additional budget');
    }

    // International student recommendations
    if (userPreferences.inclusivity_needs.international_student) {
      recommendations.push('🌍 Factor in potential currency exchange rate fluctuations');
      recommendations.push('📋 Consider additional documentation and application fees');
    }

    // General financial health recommendations
    recommendations.push('📊 Track your spending to ensure you stay within budget');
    recommendations.push('🏦 Consider setting up automatic savings for future rent payments');
    recommendations.push('📈 Review your budget monthly and adjust as needed');

    return recommendations;
  }

  /**
   * Perform comprehensive budget analysis
   */
  static analyzeBudget(
    listing: Listing,
    userPreferences: UserPreferences
  ): BudgetAnalysis {
    const totalMonthlyCost = this.calculateTotalMonthlyCost(listing);
    const affordabilityRatio = this.calculateAffordabilityRatio(totalMonthlyCost, userPreferences.budget);
    const depositSchedule = this.generateDepositSchedule(listing);
    const whatIfScenarios = this.generateWhatIfScenarios(listing, userPreferences.budget);
    const recommendations = this.generateBudgetRecommendations(listing, userPreferences.budget, userPreferences);

    return {
      total_monthly_cost: totalMonthlyCost,
      affordability_ratio: affordabilityRatio,
      deposit_schedule: depositSchedule,
      what_if_scenarios: whatIfScenarios,
      recommendations: recommendations
    };
  }

  /**
   * Compare multiple listings financially
   */
  static compareListings(listings: Listing[], userPreferences: UserPreferences): {
    listing_id: number;
    name: string;
    total_cost: number;
    affordability_ratio: number;
    value_score: number;
  }[] {
    return listings.map(listing => {
      const totalCost = this.calculateTotalMonthlyCost(listing);
      const affordabilityRatio = this.calculateAffordabilityRatio(totalCost, userPreferences.budget);
      
      // Calculate value score (lower cost + better features = higher score)
      const valueScore = (userPreferences.budget - totalCost) / userPreferences.budget * 100;
      
      return {
        listing_id: parseInt(listing.id),
        name: listing.title,
        total_cost: totalCost,
        affordability_ratio: affordabilityRatio,
        value_score: Math.max(0, valueScore)
      };
    }).sort((a, b) => b.value_score - a.value_score);
  }

  /**
   * Generate budget timeline
   */
  static generateBudgetTimeline(listing: Listing, months: number = 12): {
    month: number;
    rent: number;
    utilities: number;
    total: number;
    cumulative: number;
  }[] {
    const timeline = [];
    let cumulative = 0;

    for (let month = 1; month <= months; month++) {
      const rent = listing.rent;
      const utilities = listing.avg_utils || 0;
      const total = rent + utilities;
      cumulative += total;

      timeline.push({
        month,
        rent,
        utilities,
        total,
        cumulative
      });
    }

    return timeline;
  }

  /**
   * Calculate savings potential
   */
  static calculateSavingsPotential(
    listing: Listing,
    userBudget: number,
    savingsGoal: number
  ): {
    monthly_savings: number;
    months_to_goal: number;
    achievable: boolean;
  } {
    const totalCost = this.calculateTotalMonthlyCost(listing);
    const monthlySavings = userBudget - totalCost;
    const monthsToGoal = savingsGoal / monthlySavings;
    const achievable = monthlySavings > 0 && monthsToGoal > 0;

    return {
      monthly_savings: monthlySavings,
      months_to_goal: monthsToGoal,
      achievable: achievable
    };
  }
}
