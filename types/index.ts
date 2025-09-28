// Core types for the Inclusive Housing Navigator

export interface Subscores {
  affordability: number;
  accessibility: number;
  safety: number;
  commute: number;
  inclusivity: number;
}

export interface Listing {
  id: string;
  title: string;
  addr: string;
  lat?: number;
  lng?: number;
  rent: number;
  avg_utils?: number;
  deposit?: number;
  fees?: number;
  incl_utils?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  
  // Accessibility features
  step_free?: boolean;
  elevator?: boolean;
  doorway_width_cm?: number;
  acc_bath?: boolean;
  acc_parking?: boolean;
  
  // Safety features
  mgmt_hours_late?: string;
  well_lit?: boolean;
  dist_to_campus_km?: number;
  
  // Commute features
  bus_headway_min?: number;
  walk_min?: number;
  grocery_km?: number;
  clinic_km?: number;
  
  // Inclusivity features
  accepts_international?: boolean;
  no_ssn_ok?: boolean;
  cosigner_ok?: boolean;
  anti_disc_policy?: boolean;
  
  // Subscores
  subscores?: Subscores;
  di_score: number;
}

export interface UserProfile {
  budget: number;
  max_rent: number;
  bedrooms: number;
  bathrooms: number;
  accessibility_needs: string[];
  commute_preferences: {
    max_walk_time: number;
    max_bus_frequency: number;
    winter_penalty: boolean;
  };
  inclusivity_needs: {
    international_student: boolean;
    no_ssn: boolean;
    needs_cosigner: boolean;
  };
  language: string;
  pet_friendly: boolean;
  smoking_allowed: boolean;
}

export interface DIScore {
  overall: number;
  affordability: number;
  accessibility: number;
  safety: number;
  commute: number;
  inclusivity: number;
  tier: 'Gold' | 'Silver' | 'Bronze' | 'Needs Improvement';
  breakdown: string;
  rationale: {
    affordability: string;
    accessibility: string;
    safety: string;
    commute: string;
    inclusivity: string;
  };
}

export interface ScoredListing extends Omit<Listing, 'di_score'> {
  di_score: DIScore;
}

export interface UserPreferences {
  budget: number;
  max_rent: number;
  bedrooms: number;
  bathrooms: number;
  accessibility_needs: string[];
  commute_preferences: {
    max_walk_time: number;
    max_bus_frequency: number;
    winter_penalty: boolean;
  };
  inclusivity_needs: {
    international_student: boolean;
    no_ssn: boolean;
    needs_cosigner: boolean;
  };
  language: string;
  pet_friendly: boolean;
  smoking_allowed: boolean;
}

export interface LeaseQA {
  summary: string;
  red_flags: string[];
  translation: string;
  key_terms: string[];
  recommendations: string[];
  compliance_notes: string[];
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar';
  data: any[];
  options: {
    title: string;
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
    legend?: boolean;
    responsive?: boolean;
  };
  justification: string;
}

export interface AutoVizRequest {
  dataset: string;
  analysis_type: 'distribution' | 'correlation' | 'trends' | 'comparison';
  focus_metrics: string[];
  user_context: string;
}

export interface ComplianceCheck {
  fha_compliant: boolean;
  ada_compliant: boolean;
  risk_level: 'Low' | 'Medium' | 'High';
  flagged_fields: string[];
  recommendations: string[];
  compliance_score: number;
}

export interface BudgetAnalysis {
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
}

export interface CoStarInsights {
  market_stats: {
    avg_rent: number;
    price_trend: 'increasing' | 'decreasing' | 'stable';
    vacancy_rate: number;
    cap_rate: number;
  };
  neighborhood_analysis: {
    walkability: number;
    transit_score: number;
    safety_score: number;
    amenities_score: number;
  };
  investment_metrics: {
    roi_potential: 'High' | 'Medium' | 'Low';
    appreciation_rate: number;
    rental_yield: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  min_rent?: number;
  max_rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  accessibility?: string[];
  pet_friendly?: boolean;
  smoking_allowed?: boolean;
  min_di_score?: number;
  max_distance?: number;
  sort_by?: 'di_score' | 'rent' | 'distance' | 'name';
  sort_order?: 'asc' | 'desc';
}

export interface AccessibilityFeatures {
  visual: string[];
  motor: string[];
  cognitive: string[];
  hearing: string[];
}

export interface A11yAuditResult {
  score: number;
  issues: {
    critical: string[];
    serious: string[];
    moderate: string[];
    minor: string[];
  };
  recommendations: string[];
  wcag_level: 'A' | 'AA' | 'AAA';
}
