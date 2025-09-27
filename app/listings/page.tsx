'use client';

import React, { useState, useEffect } from 'react';
import { Listing } from '@/types';
import { ListingCard } from '@/components/ui/ListingCard';
import { SearchFilters } from '@/components/listings/SearchFilters';
import { MapView } from '@/components/listings/MapView';
import { ComparisonPanel } from '@/components/listings/ComparisonPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid, Map, Filter, Building2 } from 'lucide-react';

interface ListingsPageProps {
  searchParams: {
    maxRent?: string;
    minScore?: string;
    accessibility?: string;
    compare?: string;
  };
}

async function fetchListings(filters: {
  maxRent?: string;
  minScore?: string;
  accessibility?: string;
}): Promise<Listing[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters.maxRent) queryParams.append('maxRent', filters.maxRent);
    if (filters.minScore) queryParams.append('minScore', filters.minScore);
    if (filters.accessibility) queryParams.append('accessibility', filters.accessibility);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/listings?${queryParams.toString()}`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    } else {
      const mockResponse = await fetch('/data/listings.json');
      const mockData = await mockResponse.json();
      return mockData.filter((listing: Listing) => {
        if (filters.maxRent && listing.rent > parseInt(filters.maxRent)) return false;
        if (filters.minScore && listing.di_score < parseInt(filters.minScore)) return false;
        if (filters.accessibility && !(listing.acc_bath || listing.elevator || listing.step_free)) return false;
        return true;
      });
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return [];
  }
}

export default function ListingsPage({ searchParams }: ListingsPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await fetchListings({
          maxRent: searchParams.maxRent,
          minScore: searchParams.minScore,
          accessibility: searchParams.accessibility,
        });
        setListings(data);
      } catch (error) {
        console.error('Failed to load listings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, [searchParams]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white text-shadow mb-2">
                Housing Listings
              </h1>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Find your perfect inclusive housing match with D&I scoring
              </p>
            </div>
          </div>
          
          {/* Filter Summary */}
          <div className="flex flex-wrap gap-3">
            {searchParams.maxRent && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                Max: ${searchParams.maxRent}
              </div>
            )}
            {searchParams.minScore && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                Min Score: {searchParams.minScore}
              </div>
            )}
            {searchParams.accessibility && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                ♿ Accessible
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <SearchFilters />
            </div>
          </div>

          {/* Right Content - Results */}
          <div className="lg:col-span-3">
            {/* View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-4"
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Grid View
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="px-4"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Map View
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowComparison(true)}
                  variant="glass"
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Compare Listings
                </Button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-white/20 rounded mb-4"></div>
                      <div className="h-3 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 bg-white/20 rounded mb-4"></div>
                      <div className="h-8 bg-white/20 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onViewDetails={() => console.log('View details:', listing.id)}
                        onSaveListing={() => console.log('Save listing:', listing.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Map className="w-5 h-5" />
                        Location View
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MapView listings={listings} />
                    </CardContent>
                  </Card>
                )}
                
                {listings.length === 0 && (
                  <Card className="p-12 text-center">
                    <CardContent>
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white/50" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No listings found</h3>
                      <p className="text-white/70 mb-4">No listings found matching your criteria.</p>
                      <p className="text-white/50 text-sm">Try adjusting your search filters.</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>

        {/* Comparison Panel */}
        {showComparison && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <ComparisonPanel
                listings={listings}
                onClose={() => setShowComparison(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}