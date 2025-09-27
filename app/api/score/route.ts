import { NextRequest, NextResponse } from 'next/server';
import { DIScoringAlgorithm } from '@/lib/scoring/algorithm';
import { HousingListing, UserPreferences } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing, userPreferences }: { listing: HousingListing; userPreferences: UserPreferences } = body;

    if (!listing || !userPreferences) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: listing and userPreferences' },
        { status: 400 }
      );
    }

    // Calculate D&I score
    const diScore = DIScoringAlgorithm.calculateOverallScore(listing, userPreferences);

    return NextResponse.json({
      success: true,
      data: {
        listing_id: listing.id,
        di_score: diScore,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error calculating D&I score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate D&I score' },
      { status: 500 }
    );
  }
}
