import { NextRequest, NextResponse } from 'next/server';

interface BudgetAnalysis {
  total_monthly_cost: number;
  affordability_ratio: number;
  deposit_schedule: {
    first_month: number;
    last_month: number;
    security_deposit: number;
  };
  what_if_scenarios: {
    scenario: string;
    impact: string;
    new_cost: number;
  }[];
  recommendations: string[];
  budget_timeline: {
    month: number;
    rent: number;
    utilities: number;
    total: number;
    cumulative: number;
  }[];
  savings_potential: {
    monthly_savings: number;
    months_to_goal: number;
    achievable: boolean;
  };
  affordability_gauge: {
    status: 'excellent' | 'good' | 'caution' | 'danger';
    percentage: number;
    message: string;
  };
}

interface BudgetRequest {
  listing_id: string;
  user_budget: number;
  savings_goal?: number;
  timeline_months?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { listing_id, user_budget, savings_goal = 0, timeline_months = 12 }: BudgetRequest = await request.json();

    if (!listing_id || !user_budget) {
      return NextResponse.json(
        { error: 'Listing ID and user budget are required' },
        { status: 400 }
      );
    }

    // Mock listing data - in production, this would fetch from database
    const mockListing = {
      id: listing_id,
      rent: 1200,
      avg_utils: 150,
      deposit: 1200,
      fees: 100,
      incl_utils: false
    };

    // Calculate total monthly cost
    const totalMonthlyCost = mockListing.rent + (mockListing.incl_utils ? 0 : mockListing.avg_utils);
    
    // Calculate affordability ratio
    const affordabilityRatio = totalMonthlyCost / user_budget;
    
    // Generate deposit schedule
    const depositSchedule = {
      first_month: mockListing.rent + mockListing.avg_utils + mockListing.deposit + mockListing.fees,
      last_month: mockListing.rent + mockListing.avg_utils,
      security_deposit: mockListing.deposit
    };

    // Generate what-if scenarios
    const whatIfScenarios = [
      {
        scenario: 'Rent increases by 5% next year',
        impact: `Monthly cost would increase by $${(mockListing.rent * 0.05).toFixed(2)}`,
        new_cost: totalMonthlyCost + (mockListing.rent * 0.05)
      },
      {
        scenario: 'Utilities increase by 20%',
        impact: `Monthly cost would increase by $${(mockListing.avg_utils * 0.20).toFixed(2)}`,
        new_cost: totalMonthlyCost + (mockListing.avg_utils * 0.20)
      },
      {
        scenario: 'Need 3-month emergency fund',
        impact: `Should save $${(totalMonthlyCost * 3).toFixed(2)} for emergencies`,
        new_cost: totalMonthlyCost * 3
      },
      {
        scenario: 'Both rent and utilities increase by 10%',
        impact: `Monthly cost would increase by $${((mockListing.rent + mockListing.avg_utils) * 0.10).toFixed(2)}`,
        new_cost: totalMonthlyCost + ((mockListing.rent + mockListing.avg_utils) * 0.10)
      }
    ];

    // Generate budget timeline
    const budgetTimeline = [];
    let cumulative = 0;
    for (let month = 1; month <= timeline_months; month++) {
      const rent = mockListing.rent;
      const utilities = mockListing.avg_utils;
      const total = rent + utilities;
      cumulative += total;
      
      budgetTimeline.push({
        month,
        rent,
        utilities,
        total,
        cumulative
      });
    }

    // Calculate savings potential
    const monthlySavings = user_budget - totalMonthlyCost;
    const monthsToGoal = savings_goal > 0 ? savings_goal / monthlySavings : 0;
    const achievable = monthlySavings > 0 && monthsToGoal > 0;

    // Generate affordability gauge
    let affordabilityGauge;
    if (affordabilityRatio <= 0.3) {
      affordabilityGauge = {
        status: 'excellent' as const,
        percentage: Math.round((1 - affordabilityRatio) * 100),
        message: 'Excellent! This housing fits comfortably within your budget.'
      };
    } else if (affordabilityRatio <= 0.5) {
      affordabilityGauge = {
        status: 'good' as const,
        percentage: Math.round((1 - affordabilityRatio) * 100),
        message: 'Good fit! This housing uses a reasonable portion of your budget.'
      };
    } else if (affordabilityRatio <= 0.7) {
      affordabilityGauge = {
        status: 'caution' as const,
        percentage: Math.round((1 - affordabilityRatio) * 100),
        message: 'Caution: This housing uses a significant portion of your budget.'
      };
    } else {
      affordabilityGauge = {
        status: 'danger' as const,
        percentage: Math.round((1 - affordabilityRatio) * 100),
        message: 'Warning: This housing may strain your budget significantly.'
      };
    }

    // Generate recommendations
    const recommendations = [];
    
    if (affordabilityRatio > 0.5) {
      recommendations.push('⚠️ This housing exceeds 50% of your budget - consider more affordable options');
    } else if (affordabilityRatio > 0.3) {
      recommendations.push('⚠️ This housing uses 30-50% of your budget - ensure you have enough for other expenses');
    } else {
      recommendations.push('✅ This housing fits well within your budget');
    }

    if (depositSchedule.security_deposit > user_budget * 2) {
      recommendations.push('💰 High deposit required - ensure you have sufficient savings');
    }

    if (!mockListing.incl_utils) {
      recommendations.push('⚡ Utilities not included - budget for variable costs');
    }

    if (monthlySavings < 200) {
      recommendations.push('💡 Consider building a larger emergency fund before moving in');
    }

    recommendations.push('📊 Track your spending to ensure you stay within budget');
    recommendations.push('🏦 Consider setting up automatic savings for future rent payments');
    recommendations.push('📈 Review your budget monthly and adjust as needed');

    const analysis: BudgetAnalysis = {
      total_monthly_cost: totalMonthlyCost,
      affordability_ratio: affordabilityRatio,
      deposit_schedule: depositSchedule,
      what_if_scenarios: whatIfScenarios,
      recommendations,
      budget_timeline: budgetTimeline,
      savings_potential: {
        monthly_savings: monthlySavings,
        months_to_goal: monthsToGoal,
        achievable
      },
      affordability_gauge: affordabilityGauge
    };

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Budget analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze budget' },
      { status: 500 }
    );
  }
}