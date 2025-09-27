import { NextRequest, NextResponse } from 'next/server';
import { BudgetPlanner } from '@/lib/budget/budget-planner';
import { HousingListing, UserPreferences } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      listing, 
      userPreferences, 
      analysis_type = 'full' 
    }: { 
      listing: HousingListing; 
      userPreferences: UserPreferences;
      analysis_type?: 'full' | 'quick' | 'compare';
    } = body;

    if (!listing || !userPreferences) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: listing and userPreferences' },
        { status: 400 }
      );
    }

    let analysis;

    switch (analysis_type) {
      case 'quick':
        analysis = {
          total_monthly_cost: BudgetPlanner.calculateTotalMonthlyCost(listing),
          affordability_ratio: BudgetPlanner.calculateAffordabilityRatio(
            BudgetPlanner.calculateTotalMonthlyCost(listing), 
            userPreferences.budget
          ),
          deposit_schedule: BudgetPlanner.generateDepositSchedule(listing)
        };
        break;
      
      case 'compare':
        // For comparison, we'd need multiple listings
        analysis = {
          message: 'Comparison analysis requires multiple listings'
        };
        break;
      
      case 'full':
      default:
        analysis = BudgetPlanner.analyzeBudget(listing, userPreferences);
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        analysis_type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error performing budget analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform budget analysis' },
      { status: 500 }
    );
  }
}
