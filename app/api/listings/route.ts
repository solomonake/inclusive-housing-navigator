import { NextRequest, NextResponse } from 'next/server';
import { HousingListing, FilterOptions, PaginatedResponse } from '@/types';
import { DIScoringAlgorithm } from '@/lib/scoring/algorithm';
import { readFileSync } from 'fs';
import { join } from 'path';

// Mock data loader - in production, this would connect to your database
function loadListings(): HousingListing[] {
  try {
    const dataPath = join(process.cwd(), 'data', 'sample_listings.csv');
    const csvData = readFileSync(dataPath, 'utf-8');
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map((line, index) => {
      const values = line.split(',');
      return {
        id: parseInt(values[0]) || index + 1,
        name: values[1] || `Listing ${index + 1}`,
        address: values[2] || 'Address not available',
        rent: parseFloat(values[3]) || 0,
        utilities: parseFloat(values[4]) || 0,
        deposits: parseFloat(values[5]) || 0,
        bedrooms: parseInt(values[6]) || 1,
        bathrooms: parseInt(values[7]) || 1,
        sqft: parseInt(values[8]) || 500,
        lat: parseFloat(values[9]) || 37.2296,
        lng: parseFloat(values[10]) || -80.4139,
        step_free_entry: values[11] === 'true',
        elevator: values[12] === 'true',
        doorway_width: parseInt(values[13]) || 30,
        accessible_bathroom: values[14] === 'true',
        accessible_parking: values[15] === 'true',
        management_hours: values[16] || '9-17',
        lit_streets: values[17] === 'true',
        distance_to_campus: parseFloat(values[18]) || 1.0,
        walk_time: parseInt(values[19]) || 15,
        bus_frequency: parseInt(values[20]) || 20,
        accepts_international: values[21] === 'true',
        no_ssn_required: values[22] === 'true',
        allows_cosigner: values[23] === 'true',
        anti_discrimination_policy: values[24] === 'true',
        responsive_comms: values[25] === 'true',
        description: values[26] || 'No description available',
        images: values[27] ? values[27].split('|') : [],
        amenities: values[28] ? values[28].split('|') : [],
        pet_friendly: values[29] === 'true',
        smoking_allowed: values[30] === 'false',
        laundry: values[31] === 'true',
        internet: values[32] === 'true',
        utilities_included: values[33] === 'true',
        air_conditioning: values[34] === 'true',
        heating: values[35] === 'true',
        security_features: values[36] ? values[36].split('|') : [],
        neighborhood_safety_score: parseInt(values[37]) || 70,
        transit_score: parseInt(values[38]) || 70,
        walkability_score: parseInt(values[39]) || 70
      };
    });
  } catch (error) {
    console.error('Error loading listings:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const filters: FilterOptions = {
      min_rent: searchParams.get('min_rent') ? parseInt(searchParams.get('min_rent')!) : undefined,
      max_rent: searchParams.get('max_rent') ? parseInt(searchParams.get('max_rent')!) : undefined,
      bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
      bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
      pet_friendly: searchParams.get('pet_friendly') === 'true' ? true : undefined,
      smoking_allowed: searchParams.get('smoking_allowed') === 'true' ? true : undefined,
      min_di_score: searchParams.get('min_di_score') ? parseInt(searchParams.get('min_di_score')!) : undefined,
      max_distance: searchParams.get('max_distance') ? parseFloat(searchParams.get('max_distance')!) : undefined,
      sort_by: (searchParams.get('sort_by') as any) || 'di_score',
      sort_order: (searchParams.get('sort_order') as any) || 'desc'
    };

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Load and filter listings
    let listings = loadListings();

    // Apply filters
    if (filters.min_rent !== undefined) {
      listings = listings.filter(l => l.rent >= filters.min_rent!);
    }
    if (filters.max_rent !== undefined) {
      listings = listings.filter(l => l.rent <= filters.max_rent!);
    }
    if (filters.bedrooms !== undefined) {
      listings = listings.filter(l => l.bedrooms >= filters.bedrooms!);
    }
    if (filters.bathrooms !== undefined) {
      listings = listings.filter(l => l.bathrooms >= filters.bathrooms!);
    }
    if (filters.pet_friendly !== undefined) {
      listings = listings.filter(l => l.pet_friendly === filters.pet_friendly);
    }
    if (filters.smoking_allowed !== undefined) {
      listings = listings.filter(l => l.smoking_allowed === filters.smoking_allowed);
    }
    if (filters.max_distance !== undefined) {
      listings = listings.filter(l => l.distance_to_campus <= filters.max_distance!);
    }

    // Calculate D&I scores (using default user preferences for now)
    const defaultPreferences = {
      budget: 2000,
      max_rent: 1500,
      bedrooms: 1,
      bathrooms: 1,
      accessibility_needs: [],
      commute_preferences: {
        max_walk_time: 20,
        max_bus_frequency: 15,
        winter_penalty: false
      },
      inclusivity_needs: {
        international_student: false,
        no_ssn: false,
        needs_cosigner: false
      },
      language: 'en',
      pet_friendly: false,
      smoking_allowed: false
    };

    const scoredListings = DIScoringAlgorithm.scoreListings(listings, defaultPreferences);

    // Apply D&I score filter
    if (filters.min_di_score !== undefined) {
      listings = scoredListings.filter(l => l.di_score.overall >= filters.min_di_score!);
    }

    // Sort listings
    scoredListings.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (filters.sort_by) {
        case 'rent':
          aValue = a.rent;
          bValue = b.rent;
          break;
        case 'distance':
          aValue = a.distance_to_campus;
          bValue = b.distance_to_campus;
          break;
        case 'name':
          return filters.sort_order === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'di_score':
        default:
          aValue = a.di_score.overall;
          bValue = b.di_score.overall;
          break;
      }
      
      return filters.sort_order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = scoredListings.slice(startIndex, endIndex);

    const response: PaginatedResponse<typeof scoredListings[0]> = {
      data: paginatedListings,
      pagination: {
        page,
        limit,
        total: scoredListings.length,
        totalPages: Math.ceil(scoredListings.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
