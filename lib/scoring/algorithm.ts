import { HousingListing, DIScore, UserPreferences } from '@/types';

/**
 * D&I Scoring Algorithm
 * Score = 0.35*Affordability + 0.20*Accessibility + 0.20*Safety + 0.15*Commute + 0.10*Inclusivity
 */

export class DIScoringAlgorithm {
  private static readonly WEIGHTS = {
    AFFORDABILITY: 0.35,
    ACCESSIBILITY: 0.20,
    SAFETY: 0.20,
    COMMUTE: 0.15,
    INCLUSIVITY: 0.10
  };

  /**
   * Calculate affordability score (0-100)
   * Higher score = more affordable
   */
  static calculateAffordabilityScore(
    rent: number,
    utilities: number,
    deposits: number,
    userBudget: number = 2000
  ): { score: number; rationale: string } {
    const totalMonthlyCost = rent + utilities + (deposits / 12);
    const budgetRatio = totalMonthlyCost / userBudget;
    
    let score: number;
    let rationale: string;

    if (budgetRatio <= 0.3) {
      score = 100;
      rationale = `Excellent affordability: ${totalMonthlyCost.toFixed(0)}/month is only ${(budgetRatio * 100).toFixed(1)}% of your budget`;
    } else if (budgetRatio <= 0.5) {
      score = 80;
      rationale = `Good affordability: ${totalMonthlyCost.toFixed(0)}/month is ${(budgetRatio * 100).toFixed(1)}% of your budget`;
    } else if (budgetRatio <= 0.7) {
      score = 60;
      rationale = `Moderate affordability: ${totalMonthlyCost.toFixed(0)}/month is ${(budgetRatio * 100).toFixed(1)}% of your budget`;
    } else {
      score = Math.max(0, 100 - ((budgetRatio - 0.7) / 0.3) * 100);
      rationale = `High cost: ${totalMonthlyCost.toFixed(0)}/month is ${(budgetRatio * 100).toFixed(1)}% of your budget`;
    }

    return { score, rationale };
  }

  /**
   * Calculate accessibility score (0-100)
   */
  static calculateAccessibilityScore(listing: HousingListing): { score: number; rationale: string } {
    let score = 0;
    const features: string[] = [];

    if (listing.step_free_entry) {
      score += 25;
      features.push('Step-free entry');
    }
    
    if (listing.elevator) {
      score += 20;
      features.push('Elevator access');
    }
    
    if (listing.doorway_width >= 36) {
      score += 20;
      features.push('ADA-compliant doorways (36"+ wide)');
    } else if (listing.doorway_width >= 32) {
      score += 15;
      features.push('Wide doorways (32"+ wide)');
    }
    
    if (listing.accessible_bathroom) {
      score += 20;
      features.push('Accessible bathroom');
    }
    
    if (listing.accessible_parking) {
      score += 15;
      features.push('Accessible parking');
    }

    const rationale = features.length > 0 
      ? `Accessibility features: ${features.join(', ')}`
      : 'Limited accessibility features available';

    return { score, rationale };
  }

  /**
   * Calculate safety score (0-100)
   */
  static calculateSafetyScore(listing: HousingListing): { score: number; rationale: string } {
    let score = 0;
    const factors: string[] = [];

    // Distance to campus (closer is safer)
    if (listing.distance_to_campus <= 0.5) {
      score += 30;
      factors.push('Very close to campus');
    } else if (listing.distance_to_campus <= 1.0) {
      score += 25;
      factors.push('Close to campus');
    } else if (listing.distance_to_campus <= 1.5) {
      score += 20;
      factors.push('Moderate distance to campus');
    } else {
      score += 10;
      factors.push('Far from campus');
    }

    // Well-lit streets
    if (listing.lit_streets) {
      score += 20;
      factors.push('Well-lit streets');
    }

    // Management hours
    if (listing.management_hours === '24/7') {
      score += 25;
      factors.push('24/7 management');
    } else if (listing.management_hours.includes('8-22') || listing.management_hours.includes('9-19')) {
      score += 20;
      factors.push('Extended management hours');
    } else {
      score += 15;
      factors.push('Standard management hours');
    }

    // Neighborhood safety score
    score += listing.neighborhood_safety_score * 0.25;
    factors.push(`Neighborhood safety: ${listing.neighborhood_safety_score}/100`);

    const rationale = `Safety factors: ${factors.join(', ')}`;

    return { score: Math.min(100, score), rationale };
  }

  /**
   * Calculate commute score (0-100)
   */
  static calculateCommuteScore(
    listing: HousingListing,
    winterPenalty: boolean = false
  ): { score: number; rationale: string } {
    let score = 0;
    const factors: string[] = [];

    // Walk time (shorter is better)
    if (listing.walk_time <= 5) {
      score += 40;
      factors.push('Very short walk (≤5 min)');
    } else if (listing.walk_time <= 10) {
      score += 35;
      factors.push('Short walk (≤10 min)');
    } else if (listing.walk_time <= 15) {
      score += 30;
      factors.push('Moderate walk (≤15 min)');
    } else if (listing.walk_time <= 20) {
      score += 20;
      factors.push('Long walk (≤20 min)');
    } else {
      score += 10;
      factors.push('Very long walk (>20 min)');
    }

    // Bus frequency (more frequent is better)
    if (listing.bus_frequency <= 5) {
      score += 30;
      factors.push('Frequent bus service (≤5 min)');
    } else if (listing.bus_frequency <= 10) {
      score += 25;
      factors.push('Regular bus service (≤10 min)');
    } else if (listing.bus_frequency <= 15) {
      score += 20;
      factors.push('Moderate bus service (≤15 min)');
    } else if (listing.bus_frequency <= 20) {
      score += 15;
      factors.push('Limited bus service (≤20 min)');
    } else {
      score += 10;
      factors.push('Infrequent bus service (>20 min)');
    }

    // Distance penalty
    if (listing.distance_to_campus > 1.0) {
      score *= 0.8;
      factors.push('Distance penalty applied');
    }

    // Winter penalty
    if (winterPenalty) {
      score *= 0.9;
      factors.push('Winter conditions penalty');
    }

    const rationale = `Commute factors: ${factors.join(', ')}`;

    return { score: Math.min(100, score), rationale };
  }

  /**
   * Calculate inclusivity score (0-100)
   */
  static calculateInclusivityScore(listing: HousingListing): { score: number; rationale: string } {
    let score = 0;
    const features: string[] = [];

    if (listing.accepts_international) {
      score += 25;
      features.push('Accepts international students');
    }
    
    if (listing.no_ssn_required) {
      score += 20;
      features.push('No SSN required');
    }
    
    if (listing.allows_cosigner) {
      score += 20;
      features.push('Allows cosigners');
    }
    
    if (listing.anti_discrimination_policy) {
      score += 20;
      features.push('Anti-discrimination policy');
    }
    
    if (listing.responsive_comms) {
      score += 15;
      features.push('Responsive communication');
    }

    const rationale = features.length > 0 
      ? `Inclusivity features: ${features.join(', ')}`
      : 'Limited inclusivity features available';

    return { score, rationale };
  }

  /**
   * Calculate overall D&I score
   */
  static calculateOverallScore(
    listing: HousingListing,
    userPreferences: UserPreferences
  ): DIScore {
    const affordability = this.calculateAffordabilityScore(
      listing.rent,
      listing.utilities,
      listing.deposits,
      userPreferences.budget
    );

    const accessibility = this.calculateAccessibilityScore(listing);
    const safety = this.calculateSafetyScore(listing);
    const commute = this.calculateCommuteScore(listing, userPreferences.commute_preferences.winter_penalty);
    const inclusivity = this.calculateInclusivityScore(listing);

    const overall = 
      affordability.score * this.WEIGHTS.AFFORDABILITY +
      accessibility.score * this.WEIGHTS.ACCESSIBILITY +
      safety.score * this.WEIGHTS.SAFETY +
      commute.score * this.WEIGHTS.COMMUTE +
      inclusivity.score * this.WEIGHTS.INCLUSIVITY;

    const tier = overall >= 90 ? 'Gold' : 
                 overall >= 80 ? 'Silver' : 
                 overall >= 70 ? 'Bronze' : 'Needs Improvement';

    const breakdown = `Affordability: ${affordability.score.toFixed(1)} (35%) | ` +
                     `Accessibility: ${accessibility.score.toFixed(1)} (20%) | ` +
                     `Safety: ${safety.score.toFixed(1)} (20%) | ` +
                     `Commute: ${commute.score.toFixed(1)} (15%) | ` +
                     `Inclusivity: ${inclusivity.score.toFixed(1)} (10%)`;

    return {
      overall: Math.round(overall * 10) / 10,
      affordability: Math.round(affordability.score * 10) / 10,
      accessibility: Math.round(accessibility.score * 10) / 10,
      safety: Math.round(safety.score * 10) / 10,
      commute: Math.round(commute.score * 10) / 10,
      inclusivity: Math.round(inclusivity.score * 10) / 10,
      tier,
      breakdown,
      rationale: {
        affordability: affordability.rationale,
        accessibility: accessibility.rationale,
        safety: safety.rationale,
        commute: commute.rationale,
        inclusivity: inclusivity.rationale
      }
    };
  }

  /**
   * Score multiple listings
   */
  static scoreListings(
    listings: HousingListing[],
    userPreferences: UserPreferences
  ): ScoredListing[] {
    return listings.map(listing => ({
      ...listing,
      di_score: this.calculateOverallScore(listing, userPreferences)
    })).sort((a, b) => b.di_score.overall - a.di_score.overall);
  }
}
