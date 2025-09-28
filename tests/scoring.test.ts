import { DIScoringAlgorithm } from '../lib/scoring/algorithm';
import { Listing, UserPreferences } from '../types';

// Mock listing data for testing
const mockListing: Listing = {
  id: '1',
  title: 'Test Listing',
  addr: '123 Test St',
  rent: 1200,
  avg_utils: 150,
  deposit: 1200,
  bedrooms: 2,
  bathrooms: 1,
  step_free: true,
  elevator: true,
  doorway_width_cm: 91,
  acc_bath: true,
  acc_parking: true,
  well_lit: true,
  dist_to_campus_km: 0.5,
  walk_min: 10,
  bus_headway_min: 15,
  accepts_international: true,
  no_ssn_ok: true,
  cosigner_ok: true,
  anti_disc_policy: true,
  di_score: 0, // Will be calculated
  subscores: {
    affordability: 0,
    accessibility: 0,
    safety: 0,
    commute: 0,
    inclusivity: 0
  }
};

const mockUserPreferences: UserPreferences = {
  budget: 2000,
  max_rent: 1600,
  bedrooms: 2,
  bathrooms: 1,
  accessibility_needs: ['step_free', 'elevator'],
  commute_preferences: {
    max_walk_time: 20,
    max_bus_time: 30,
    car_required: false
  },
  inclusivity_needs: {
    international_student: true,
    language_preference: 'en',
    cultural_considerations: []
  },
  location_preferences: {
    max_distance_campus: 2.0,
    preferred_neighborhoods: [],
    safety_priority: 'high'
  }
};

describe('D&I Scoring Algorithm', () => {
  describe('calculateAffordabilityScore', () => {
    it('should give high score for affordable housing', () => {
      const result = DIScoringAlgorithm.calculateAffordabilityScore(1200, 150, 1200, 2000);
      expect(result.score).toBeGreaterThan(80);
      expect(result.rationale).toContain('budget');
    });

    it('should give low score for expensive housing', () => {
      const result = DIScoringAlgorithm.calculateAffordabilityScore(3000, 300, 3000, 2000);
      expect(result.score).toBeLessThan(50);
    });

    it('should handle zero budget', () => {
      const result = DIScoringAlgorithm.calculateAffordabilityScore(1200, 150, 1200, 0);
      expect(result.score).toBe(0);
    });

    it('should handle very high costs', () => {
      const result = DIScoringAlgorithm.calculateAffordabilityScore(10000, 1000, 10000, 2000);
      expect(result.score).toBe(0);
    });
  });

  describe('calculateAccessibilityScore', () => {
    it('should give high score for fully accessible housing', () => {
      const result = DIScoringAlgorithm.calculateAccessibilityScore(mockListing);
      expect(result.score).toBeGreaterThan(80);
      expect(result.rationale).toContain('Step-free entry');
      expect(result.rationale).toContain('Elevator access');
    });

    it('should give low score for inaccessible housing', () => {
      const inaccessibleListing = {
        ...mockListing,
        step_free: false,
        elevator: false,
        doorway_width_cm: 70,
        acc_bath: false,
        acc_parking: false
      };
      const result = DIScoringAlgorithm.calculateAccessibilityScore(inaccessibleListing);
      expect(result.score).toBeLessThan(30);
    });

    it('should score doorway width correctly', () => {
      const wideDoorListing = { ...mockListing, doorway_width_cm: 91 };
      const narrowDoorListing = { ...mockListing, doorway_width_cm: 70 };
      
      const wideResult = DIScoringAlgorithm.calculateAccessibilityScore(wideDoorListing);
      const narrowResult = DIScoringAlgorithm.calculateAccessibilityScore(narrowDoorListing);
      
      expect(wideResult.score).toBeGreaterThan(narrowResult.score);
    });
  });

  describe('calculateSafetyScore', () => {
    it('should give high score for close, well-lit housing', () => {
      const result = DIScoringAlgorithm.calculateSafetyScore(mockListing);
      expect(result.score).toBeGreaterThan(80);
      expect(result.rationale).toContain('Very close to campus');
    });

    it('should penalize distance from campus', () => {
      const farListing = { ...mockListing, dist_to_campus_km: 5.0 };
      const result = DIScoringAlgorithm.calculateSafetyScore(farListing);
      expect(result.score).toBeLessThan(70);
    });

    it('should reward well-lit areas', () => {
      const wellLitListing = { ...mockListing, well_lit: true };
      const darkListing = { ...mockListing, well_lit: false };
      
      const wellLitResult = DIScoringAlgorithm.calculateSafetyScore(wellLitListing);
      const darkResult = DIScoringAlgorithm.calculateSafetyScore(darkListing);
      
      expect(wellLitResult.score).toBeGreaterThan(darkResult.score);
    });
  });

  describe('calculateCommuteScore', () => {
    it('should give high score for short commute times', () => {
      const result = DIScoringAlgorithm.calculateCommuteScore(mockListing);
      expect(result.score).toBeGreaterThan(50);
    });

    it('should penalize long walk times', () => {
      const longWalkListing = { ...mockListing, walk_min: 45 };
      const result = DIScoringAlgorithm.calculateCommuteScore(longWalkListing);
      expect(result.score).toBeLessThan(50);
    });

    it('should reward frequent bus service', () => {
      const frequentBusListing = { ...mockListing, bus_headway_min: 5 };
      const infrequentBusListing = { ...mockListing, bus_headway_min: 30 };
      
      const frequentResult = DIScoringAlgorithm.calculateCommuteScore(frequentBusListing);
      const infrequentResult = DIScoringAlgorithm.calculateCommuteScore(infrequentBusListing);
      
      expect(frequentResult.score).toBeGreaterThan(infrequentResult.score);
    });
  });

  describe('calculateInclusivityScore', () => {
    it('should give high score for inclusive housing', () => {
      const result = DIScoringAlgorithm.calculateInclusivityScore(mockListing);
      expect(result.score).toBeGreaterThan(80);
      expect(result.rationale).toContain('international students');
    });

    it('should penalize non-inclusive housing', () => {
      const nonInclusiveListing = {
        ...mockListing,
        accepts_international: false,
        no_ssn_ok: false,
        cosigner_ok: false,
        anti_disc_policy: false
      };
      const result = DIScoringAlgorithm.calculateInclusivityScore(nonInclusiveListing);
      expect(result.score).toBeLessThan(30);
    });
  });

  describe('calculateOverallScore', () => {
    it('should calculate weighted overall score correctly', () => {
      const result = DIScoringAlgorithm.calculateOverallScore(mockListing, mockUserPreferences);
      
      expect(result.overall).toBeGreaterThan(0);
      expect(result.overall).toBeLessThanOrEqual(100);
      expect(result.affordability).toBeGreaterThan(0);
      expect(result.accessibility).toBeGreaterThan(0);
      expect(result.safety).toBeGreaterThan(0);
      expect(result.commute).toBeGreaterThan(0);
      expect(result.inclusivity).toBeGreaterThan(0);
    });

    it('should assign correct tier based on score', () => {
      const highScoreListing = { ...mockListing, rent: 800, avg_utils: 100 };
      const result = DIScoringAlgorithm.calculateOverallScore(highScoreListing, mockUserPreferences);
      
      if (result.overall >= 90) {
        expect(result.tier).toBe('Gold');
      } else if (result.overall >= 75) {
        expect(result.tier).toBe('Silver');
      } else if (result.overall >= 50) {
        expect(result.tier).toBe('Bronze');
      } else {
        expect(result.tier).toBe('Needs Improvement');
      }
    });

    it('should include breakdown in result', () => {
      const result = DIScoringAlgorithm.calculateOverallScore(mockListing, mockUserPreferences);
      
      expect(result.breakdown).toContain('Affordability');
      expect(result.breakdown).toContain('Accessibility');
      expect(result.breakdown).toContain('Safety');
      expect(result.breakdown).toContain('Commute');
      expect(result.breakdown).toContain('Inclusivity');
    });
  });

  describe('scoreListings', () => {
    it('should score multiple listings', () => {
      const listings = [mockListing, { ...mockListing, id: '2', rent: 1500 }];
      const results = DIScoringAlgorithm.scoreListings(listings, mockUserPreferences);
      
      expect(results).toHaveLength(2);
      expect(results[0].di_score).toBeDefined();
      expect(results[1].di_score).toBeDefined();
    });

    it('should sort listings by score', () => {
      const listings = [
        { ...mockListing, id: '1', rent: 1500 },
        { ...mockListing, id: '2', rent: 800 }
      ];
      const results = DIScoringAlgorithm.scoreListings(listings, mockUserPreferences);
      
      // The cheaper listing should have a higher score
      expect(results[0].di_score.overall).toBeGreaterThanOrEqual(results[1].di_score.overall);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional fields', () => {
      const minimalListing = {
        ...mockListing,
        doorway_width_cm: undefined,
        walk_min: undefined,
        bus_headway_min: undefined
      };
      
      const result = DIScoringAlgorithm.calculateOverallScore(minimalListing, mockUserPreferences);
      expect(result.overall).toBeGreaterThan(0);
      expect(result.overall).toBeLessThanOrEqual(100);
    });
  });
});