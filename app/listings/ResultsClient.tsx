'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Listing } from '@/types';
import { ListingMiniCard } from '@/components/ui/ListingMiniCard';
import { Drawer } from '@/components/ui/Drawer';
import { ScoreDonut } from '@/components/ui/ScoreDonut';
import { ScoreChip } from '@/components/ui/ScoreChip';
import { HeartButton } from '@/components/ui/HeartButton';
import { CompareCheckbox } from '@/components/ui/CompareCheckbox';
import { MapView } from '@/components/listings/MapView';
import { AriaLive } from '@/components/accessibility/aria-live';
import { Filter, MapPin, SlidersHorizontal } from 'lucide-react';

interface ResultsClientProps {
  listings: Listing[];
  compareIds: string[];
}

interface ScoreBreakdown {
  affordability: string;
  accessibility: string;
  safety: string;
  commute: string;
  inclusivity: string;
}

export const ResultsClient: React.FC<ResultsClientProps> = ({ listings, compareIds }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    maxRent: searchParams.get('maxRent') || '',
    minScore: searchParams.get('minScore') || '',
    accessibility: searchParams.get('accessibility') === 'true',
    petFriendly: searchParams.get('petFriendly') === 'true',
    smokingAllowed: searchParams.get('smokingAllowed') === 'true',
  });
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('');

  // Debounced URL updates
  const updateURL = useCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams();
      if (newFilters.maxRent) params.set('maxRent', newFilters.maxRent);
      if (newFilters.minScore) params.set('minScore', newFilters.minScore);
      if (newFilters.accessibility) params.set('accessibility', 'true');
      if (newFilters.petFriendly) params.set('petFriendly', 'true');
      if (newFilters.smokingAllowed) params.set('smokingAllowed', 'true');

      router.replace(`/listings?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL(filters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, updateURL]);

  // Listen for custom events
  useEffect(() => {
    const handleOpenScore = (event: CustomEvent) => {
      const { listingId, listing } = event.detail;
      setSelectedListing(listing);
      setDrawerOpen(true);
      setAriaLiveMessage(`Opening score breakdown for ${listing.title}`);
    };

    window.addEventListener('open-score', handleOpenScore as EventListener);
    return () => window.removeEventListener('open-score', handleOpenScore as EventListener);
  }, []);

  const handleFilterChange = (key: keyof typeof filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredListings = listings.filter(listing => {
    if (filters.maxRent && listing.rent > parseInt(filters.maxRent)) return false;
    if (filters.minScore && listing.di_score < parseInt(filters.minScore)) return false;
    if (filters.accessibility && !(listing.acc_bath || listing.elevator || listing.step_free)) return false;
    return true;
  });

  const getScoreBreakdown = (listing: Listing): ScoreBreakdown => {
    return {
      affordability: `Rent of ${listing.rent} is ${listing.rent < 1000 ? 'very affordable' : listing.rent < 1500 ? 'affordable' : 'above average'}`,
      accessibility: `${listing.acc_bath ? 'Has accessible bathroom' : 'No accessible bathroom'}. ${listing.elevator ? 'Has elevator' : 'No elevator'}. ${listing.step_free ? 'Step-free entry' : 'Has steps'}`,
      safety: `${listing.well_lit ? 'Well-lit area' : 'Poor lighting'}. Management available ${listing.mgmt_hours_late || 'during business hours'}`,
      commute: `${listing.dist_to_campus_km ? `${listing.dist_to_campus_km}km from campus` : 'Distance unknown'}. ${listing.bus_headway_min ? `Bus every ${listing.bus_headway_min}min` : 'Limited transit'}`,
      inclusivity: `${listing.accepts_international ? 'Accepts international students' : 'International students may face barriers'}. ${listing.no_ssn_ok ? 'No SSN required' : 'SSN required'}. ${listing.cosigner_ok ? 'Cosigner accepted' : 'Cosigner required'}`
    };
  };

  return (
    <div className="space-y-6">
      <AriaLive message={ariaLiveMessage} />

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="maxRent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Rent ($)
            </label>
            <input
              type="number"
              id="maxRent"
              value={filters.maxRent}
              onChange={(e) => handleFilterChange('maxRent', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2000"
            />
          </div>

          <div>
            <label htmlFor="minScore" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Min D&I Score
            </label>
            <input
              type="number"
              id="minScore"
              value={filters.minScore}
              onChange={(e) => handleFilterChange('minScore', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="70"
              min="0"
              max="100"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="accessibility"
              checked={filters.accessibility}
              onChange={(e) => handleFilterChange('accessibility', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="accessibility" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Accessibility Features
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="petFriendly"
              checked={filters.petFriendly}
              onChange={(e) => handleFilterChange('petFriendly', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="petFriendly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Pet Friendly
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="smokingAllowed"
              checked={filters.smokingAllowed}
              onChange={(e) => handleFilterChange('smokingAllowed', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="smokingAllowed" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Smoking Allowed
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {filteredListings.length} listings found
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Map view below</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredListings.map((listing) => (
              <ListingMiniCard key={listing.id} listing={listing} />
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No listings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Map View
            </h3>
            <MapView
              listings={filteredListings}
              selectedId={selectedListingId}
              onSelect={setSelectedListingId}
            />
          </div>
        </div>
      </div>

      {/* Score Breakdown Drawer */}
      <Drawer
        title="D&I Score Breakdown"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {selectedListing && (
          <div className="space-y-6">
            {/* Header with Score */}
            <div className="text-center">
              <ScoreDonut 
                value={selectedListing.di_score} 
                label="D&I Score" 
                size={80}
                colorClass="stroke-blue-600"
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
                {selectedListing.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedListing.addr}
              </p>
            </div>

            {/* Score Chips */}
            {selectedListing.subscores && (
              <div className="flex flex-wrap gap-2 justify-center">
                <ScoreChip label="Affordability" value={selectedListing.subscores.affordability} variant="indigo" />
                <ScoreChip label="Accessibility" value={selectedListing.subscores.accessibility} variant="emerald" />
                <ScoreChip label="Safety" value={selectedListing.subscores.safety} variant="amber" />
                <ScoreChip label="Commute" value={selectedListing.subscores.commute} variant="sky" />
                <ScoreChip label="Inclusivity" value={selectedListing.subscores.inclusivity} variant="purple" />
              </div>
            )}

            {/* Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Why this score?</h4>
              {(() => {
                const breakdown = getScoreBreakdown(selectedListing);
                return Object.entries(breakdown).map(([key, explanation]) => (
                  <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h5 className="font-medium text-gray-900 dark:text-white capitalize mb-1">
                      {key}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {explanation}
                    </p>
                  </div>
                ));
              })()}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => router.push(`/lease?id=${selectedListing.id}`)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Analyze Lease
              </button>
              <HeartButton listingId={selectedListing.id} />
              <CompareCheckbox listingId={selectedListing.id} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
