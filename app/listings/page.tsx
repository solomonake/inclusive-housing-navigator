'use client';

import React, { useState, useEffect } from 'react';
import { Listing } from '@/types';
import { CardGrid } from '@/components/ui/CardGrid';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [savedListings, setSavedListings] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    maxRent: 2000,
    minDiScore: 70,
    accessibility: false,
    international: false
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      if (data.success) {
        setListings(data.data.data);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleSaveListing = (listing: Listing) => {
    const newSaved = new Set(savedListings);
    if (newSaved.has(listing.id)) {
      newSaved.delete(listing.id);
    } else {
      newSaved.add(listing.id);
    }
    setSavedListings(newSaved);
  };

  const filteredListings = listings.filter(listing => {
    return (
      listing.rent <= filters.maxRent &&
      listing.di_score >= filters.minDiScore &&
      (!filters.accessibility || listing.step_free || listing.elevator) &&
      (!filters.international || listing.accepts_international)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bg))]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--accent))] mx-auto"></div>
            <p className="mt-4 text-[hsl(var(--fg-muted))]">Loading listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--fg))] mb-2">
            Housing Search Results
          </h1>
          <p className="text-[hsl(var(--fg-muted))]">
            Found {filteredListings.length} listings matching your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="maxRent" className="block text-sm font-medium mb-2">
                    Max Rent: ${filters.maxRent}
                  </label>
                  <input
                    id="maxRent"
                    type="range"
                    min="500"
                    max="3000"
                    step="100"
                    value={filters.maxRent}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRent: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="minDiScore" className="block text-sm font-medium mb-2">
                    Min D&I Score: {filters.minDiScore}
                  </label>
                  <input
                    id="minDiScore"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.minDiScore}
                    onChange={(e) => setFilters(prev => ({ ...prev, minDiScore: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.accessibility}
                      onChange={(e) => setFilters(prev => ({ ...prev, accessibility: e.target.checked }))}
                      className="rounded border-[hsl(var(--border))] focus-ring"
                    />
                    <span className="text-sm">Accessibility features</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.international}
                      onChange={(e) => setFilters(prev => ({ ...prev, international: e.target.checked }))}
                      className="rounded border-[hsl(var(--border))] focus-ring"
                    />
                    <span className="text-sm">International student friendly</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Map View</h3>
              <div className="h-64 bg-[hsl(var(--muted))] rounded-lg flex items-center justify-center">
                <p className="text-[hsl(var(--fg-muted))]">Map integration coming soon</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {filteredListings.length === 0 ? (
              <EmptyState
                title="No listings found"
                description="Try adjusting your filters to see more results."
                icon="🔍"
                action={{
                  label: 'Clear Filters',
                  onClick: () => setFilters({
                    maxRent: 2000,
                    minDiScore: 70,
                    accessibility: false,
                    international: false
                  })
                }}
              />
            ) : (
              <CardGrid
                listings={filteredListings}
                onViewDetails={handleViewDetails}
                onSaveListing={handleSaveListing}
                savedListings={savedListings}
              />
            )}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
      />
    </div>
  );
}
