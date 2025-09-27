import { DIScoringAlgorithm } from '@/lib/scoring/algorithm';
import { Listing, UserPreferences } from '@/types';

describe('D&I Scoring Algorithm', () => {
  const mockListing: Listing = {
    id: 1,
    name: 'Test Listing',
    address: '123 Test St',
    rent: 1200,
    utilities: 150,
    deposits: 2400,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    lat: 37.2296,
    lng: -80.4139,
    step_free_entry: true,
    elevator: true,
    doorway_width: 36,
    accessible_bathroom: true,
    accessible_parking: true,
    management_hours: '24/7',
    lit_streets: true,
    distance_to_campus: 0.5,
    walk_time: 8,
    bus_frequency: 10,
    accepts_international: true,
    no_ssn_required: true,
    allows_cosigner: true,
    anti_discrimination_policy: true,
    responsive_comms: true,
    description: 'Test description',
    images: [],
    amenities: ['Pool', 'Gym'],
    pet_friendly: true,
    smoking_allowed: false,
    laundry: true,
    internet: true,
    utilities_included: false,
    air_conditioning: true,
    heating: true,
    security_features: ['Security Cameras'],
    neighborhood_safety_score: 85,
    transit_score: 90,
    walkability_score: 95
  };

  const mockPreferences: UserPreferences = {
    budget: 2000,
    max_rent: 1500,
    bedrooms: 2,
    bathrooms: 1,
    accessibility_needs: ['Wheelchair accessible'],
    commute_preferences: {
      max_walk_time: 20,
      max_bus_frequency: 15,
      winter_penalty: false
    },
    inclusivity_needs: {
      international_student: true,
      no_ssn: true,
      needs_cosigner: true
    },
    language: 'en',
    pet_friendly: true,
    smoking_allowed: false
  };

  describe('calculateAffordabilityScore', () => {
    it('should calculate affordability score correctly', () => {
      const result = DIScoringAlgorithm.calculateAffordabilityScore(
        mockListing.rent,
        mockListing.utilities,
        mockListing.deposits,
        mockPreferences.budget
      );

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.rationale).toBeDefined();
    });

    it('should give higher score for more affordable housing', () => {
      const expensiveListing = { ...mockListing, rent: 2000, utilities: 300, deposits: 4000 };
      const cheapListing = { ...mockListing, rent: 800, utilities: 100, deposits: 1600 };

      const expensiveScore = DIScoringAlgorithm.calculateAffordabilityScore(
        expensiveListing.rent,
        expensiveListing.utilities,
        expensiveListing.deposits,
        mockPreferences.budget
      );

      const cheapScore = DIScoringAlgorithm.calculateAffordabilityScore(
        cheapListing.rent,
        cheapListing.utilities,
        cheapListing.deposits,
        mockPreferences.budget
      );

      expect(cheapScore.score).toBeGreaterThan(expensiveScore.score);
    });
  });

  describe('calculateAccessibilityScore', () => {
    it('should calculate accessibility score correctly', () => {
      const result = DIScoringAlgorithm.calculateAccessibilityScore(mockListing);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.rationale).toBeDefined();
    });

    it('should give higher score for more accessible housing', () => {
      const accessibleListing = { ...mockListing, step_free_entry: true, elevator: true, doorway_width: 36, accessible_bathroom: true, accessible_parking: true };
      const inaccessibleListing = { ...mockListing, step_free_entry: false, elevator: false, doorway_width: 30, accessible_bathroom: false, accessible_parking: false };

      const accessibleScore = DIScoringAlgorithm.calculateAccessibilityScore(accessibleListing);
      const inaccessibleScore = DIScoringAlgorithm.calculateAccessibilityScore(inaccessibleListing);

      expect(accessibleScore.score).toBeGreaterThan(inaccessibleScore.score);
    });
  });

  describe('calculateSafetyScore', () => {
    it('should calculate safety score correctly', () => {
      const result = DIScoringAlgorithm.calculateSafetyScore(mockListing);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.rationale).toBeDefined();
    });

    it('should give higher score for safer housing', () => {
      const safeListing = { ...mockListing, distance_to_campus: 0.3, lit_streets: true, management_hours: '24/7', neighborhood_safety_score: 95 };
      const unsafeListing = { ...mockListing, distance_to_campus: 2.0, lit_streets: false, management_hours: '9-17', neighborhood_safety_score: 60 };

      const safeScore = DIScoringAlgorithm.calculateSafetyScore(safeListing);
      const unsafeScore = DIScoringAlgorithm.calculateSafetyScore(unsafeListing);

      expect(safeScore.score).toBeGreaterThan(unsafeScore.score);
    });
  });

  describe('calculateCommuteScore', () => {
    it('should calculate commute score correctly', () => {
      const result = DIScoringAlgorithm.calculateCommuteScore(mockListing, false);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.rationale).toBeDefined();
    });

    it('should apply winter penalty correctly', () => {
      const normalScore = DIScoringAlgorithm.calculateCommuteScore(mockListing, false);
      const winterScore = DIScoringAlgorithm.calculateCommuteScore(mockListing, true);

      expect(winterScore.score).toBeLessThanOrEqual(normalScore.score);
    });
  });

  describe('calculateInclusivityScore', () => {
    it('should calculate inclusivity score correctly', () => {
      const result = DIScoringAlgorithm.calculateInclusivityScore(mockListing);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.rationale).toBeDefined();
    });

    it('should give higher score for more inclusive housing', () => {
      const inclusiveListing = { ...mockListing, accepts_international: true, no_ssn_required: true, allows_cosigner: true, anti_discrimination_policy: true, responsive_comms: true };
      const exclusiveListing = { ...mockListing, accepts_international: false, no_ssn_required: false, allows_cosigner: false, anti_discrimination_policy: false, responsive_comms: false };

      const inclusiveScore = DIScoringAlgorithm.calculateInclusivityScore(inclusiveListing);
      const exclusiveScore = DIScoringAlgorithm.calculateInclusivityScore(exclusiveListing);

      expect(inclusiveScore.score).toBeGreaterThan(exclusiveScore.score);
    });
  });

  describe('calculateOverallScore', () => {
    it('should calculate overall score correctly', () => {
      const result = DIScoringAlgorithm.calculateOverallScore(mockListing, mockPreferences);

      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
      expect(result.tier).toMatch(/^(Gold|Silver|Bronze|Needs Improvement)$/);
      expect(result.breakdown).toBeDefined();
      expect(result.rationale).toBeDefined();
    });

    it('should have correct tier classification', () => {
      const result = DIScoringAlgorithm.calculateOverallScore(mockListing, mockPreferences);

      if (result.overall >= 90) {
        expect(result.tier).toBe('Gold');
      } else if (result.overall >= 80) {
        expect(result.tier).toBe('Silver');
      } else if (result.overall >= 70) {
        expect(result.tier).toBe('Bronze');
      } else {
        expect(result.tier).toBe('Needs Improvement');
      }
    });

    it('should have correct weight distribution', () => {
      const result = DIScoringAlgorithm.calculateOverallScore(mockListing, mockPreferences);

      // Check that the overall score is calculated with correct weights
      const expectedScore = 
        result.affordability * 0.35 +
        result.accessibility * 0.20 +
        result.safety * 0.20 +
        result.commute * 0.15 +
        result.inclusivity * 0.10;

      expect(result.overall).toBeCloseTo(expectedScore, 1);
    });
  });

  describe('scoreListings', () => {
    it('should score multiple listings correctly', () => {
      const listings = [mockListing, { ...mockListing, id: 2, rent: 800 }];
      const scoredListings = DIScoringAlgorithm.scoreListings(listings, mockPreferences);

      expect(scoredListings).toHaveLength(2);
      expect(scoredListings[0]).toHaveProperty('di_score');
      expect(scoredListings[0].di_score).toHaveProperty('overall');
    });

    it('should sort listings by score descending', () => {
      const listings = [
        { ...mockListing, id: 1, rent: 2000 }, // Expensive
        { ...mockListing, id: 2, rent: 800 }   // Cheap
      ];
      const scoredListings = DIScoringAlgorithm.scoreListings(listings, mockPreferences);

      expect(scoredListings[0].di_score.overall).toBeGreaterThanOrEqual(scoredListings[1].di_score.overall);
    });
  });
});
