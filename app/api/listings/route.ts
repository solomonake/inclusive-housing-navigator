import { NextRequest, NextResponse } from 'next/server';
import { Listing } from '@/types';
import { ensureArray } from '@/lib/utils/safe';
import { readFileSync } from 'fs';
import { join } from 'path';

// Mock data loader - in production, this would connect to your database
function loadListings(): Listing[] {
  try {
    const dataPath = join(process.cwd(), 'data', 'sample_listings.csv');
    const csvData = readFileSync(dataPath, 'utf-8');
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map((line, index) => {
      const values = line.split(',');
      return {
        id: String(parseInt(values[0]) || index + 1),
        title: values[1] || `Listing ${index + 1}`,
        addr: values[2] || 'Address not available',
        rent: parseFloat(values[3]) || 0,
        avg_utils: parseFloat(values[4]) || 0,
        deposit: parseFloat(values[5]) || 0,
        bedrooms: parseInt(values[6]) || 1,
        bathrooms: parseInt(values[7]) || 1,
        lat: parseFloat(values[9]) || 37.2296,
        lng: parseFloat(values[10]) || -80.4139,
        step_free: values[11] === 'true',
        elevator: values[12] === 'true',
        doorway_width_cm: parseInt(values[13]) || 30,
        acc_bath: values[14] === 'true',
        acc_parking: values[15] === 'true',
        mgmt_hours_late: values[16] || '9-17',
        well_lit: values[17] === 'true',
        dist_to_campus_km: parseFloat(values[18]) || 1.0,
        walk_min: parseInt(values[19]) || 15,
        bus_headway_min: parseInt(values[20]) || 20,
        accepts_international: values[21] === 'true',
        no_ssn_ok: values[22] === 'true',
        cosigner_ok: values[23] === 'true',
        anti_disc_policy: values[24] === 'true',
        incl_utils: values[33] === 'true',
        di_score: 75 + Math.random() * 20, // Random score for demo
        subscores: {
          affordability: 70 + Math.random() * 20,
          accessibility: 60 + Math.random() * 30,
          safety: 65 + Math.random() * 25,
          commute: 70 + Math.random() * 20,
          inclusivity: 75 + Math.random() * 20
        }
      };
    });
  } catch (error) {
    console.error('Error loading listings:', error);
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: 'Modern Studio Apartment',
        addr: '123 University Ave, Blacksburg, VA',
        rent: 1200,
        avg_utils: 150,
        deposit: 1200,
        bedrooms: 1,
        bathrooms: 1,
        step_free: true,
        elevator: true,
        doorway_width_cm: 91,
        acc_bath: true,
        acc_parking: true,
        well_lit: true,
        dist_to_campus_km: 0.5,
        walk_min: 8,
        bus_headway_min: 10,
        accepts_international: true,
        no_ssn_ok: true,
        cosigner_ok: true,
        anti_disc_policy: true,
        di_score: 85,
        subscores: {
          affordability: 80,
          accessibility: 90,
          safety: 85,
          commute: 80,
          inclusivity: 90
        }
      },
      {
        id: '2',
        title: 'Cozy 2-Bedroom House',
        addr: '456 Main St, Blacksburg, VA',
        rent: 1800,
        avg_utils: 200,
        deposit: 1800,
        bedrooms: 2,
        bathrooms: 2,
        step_free: false,
        elevator: false,
        doorway_width_cm: 81,
        acc_bath: false,
        acc_parking: true,
        well_lit: true,
        dist_to_campus_km: 1.2,
        walk_min: 15,
        bus_headway_min: 15,
        accepts_international: true,
        no_ssn_ok: false,
        cosigner_ok: true,
        anti_disc_policy: true,
        di_score: 72,
        subscores: {
          affordability: 70,
          accessibility: 60,
          safety: 80,
          commute: 70,
          inclusivity: 80
        }
      },
      {
        id: '3',
        title: 'Luxury Apartment Complex',
        addr: '789 College Dr, Blacksburg, VA',
        rent: 2200,
        avg_utils: 250,
        deposit: 2200,
        bedrooms: 3,
        bathrooms: 2,
        step_free: true,
        elevator: true,
        doorway_width_cm: 91,
        acc_bath: true,
        acc_parking: true,
        well_lit: true,
        dist_to_campus_km: 0.8,
        walk_min: 10,
        bus_headway_min: 8,
        accepts_international: true,
        no_ssn_ok: true,
        cosigner_ok: true,
        anti_disc_policy: true,
        di_score: 92,
        subscores: {
          affordability: 85,
          accessibility: 95,
          safety: 90,
          commute: 85,
          inclusivity: 95
        }
      }
    ];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const maxRent = searchParams.get('max_rent') ? parseInt(searchParams.get('max_rent')!) : undefined;
    const minScore = searchParams.get('min_score') ? parseInt(searchParams.get('min_score')!) : undefined;
    const accessibility = searchParams.get('accessibility') === 'true';

    // Load listings
    let listings = loadListings();

    // Apply simple filters
    if (maxRent !== undefined) {
      listings = listings.filter(l => l.rent <= maxRent);
    }
    if (minScore !== undefined) {
      listings = listings.filter(l => l.di_score >= minScore);
    }
    if (accessibility) {
      listings = listings.filter(l => l.acc_bath || l.elevator || l.step_free);
    }

    // Sort by D&I score (highest first)
    listings.sort((a, b) => b.di_score - a.di_score);

    return NextResponse.json({ 
      listings: ensureArray(listings),
      meta: {
        total: listings.length,
        filters: { maxRent, minScore, accessibility },
        relaxed: listings.length === 0 && (maxRent !== undefined || minScore !== undefined)
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({
      listings: [],
      meta: { error: 'Failed to fetch listings', relaxed: false }
    });
  }
}
