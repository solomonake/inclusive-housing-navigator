'use client';

import React, { useState } from 'react';
import { Listing } from '@/types';
import { ListingCard } from '@/components/ui/ListingCard';

interface ComparisonPanelProps {
  listings: Listing[];
  onClose: () => void;
  className?: string;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ 
  listings, 
  onClose,
  className = '' 
}) => {
  const [selectedListings, setSelectedListings] = useState<Listing[]>([]);

  const toggleListing = (listing: Listing) => {
    setSelectedListings(prev => {
      const isSelected = prev.some(l => l.id === listing.id);
      if (isSelected) {
        return prev.filter(l => l.id !== listing.id);
      } else {
        return [...prev, listing].slice(0, 3); // Limit to 3 comparisons
      }
    });
  };

  const clearAll = () => {
    setSelectedListings([]);
  };

  const compareListings = () => {
    // In a real implementation, this would open a comparison modal or navigate to a comparison page
    console.log('Comparing listings:', selectedListings);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Compare Listings ({selectedListings.length}/3)
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close comparison panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          Select up to 3 listings to compare their features, pricing, and D&I scores.
        </p>
      </div>

      {/* Selected Listings */}
      {selectedListings.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Selected for Comparison</h4>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {selectedListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium text-sm">{listing.title}</span>
                  <span className="text-sm text-gray-600 ml-2">${listing.rent}/mo</span>
                </div>
                <button
                  onClick={() => toggleListing(listing)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  aria-label={`Remove ${listing.title} from comparison`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Actions */}
      {selectedListings.length > 1 && (
        <div className="mb-4">
          <button
            onClick={compareListings}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold min-h-[44px]"
          >
            🔍 Compare {selectedListings.length} Listings
          </button>
        </div>
      )}

      {/* Available Listings */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Available Listings</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {listings.map((listing) => {
            const isSelected = selectedListings.some(l => l.id === listing.id);
            const isDisabled = !isSelected && selectedListings.length >= 3;
            
            return (
              <div
                key={listing.id}
                className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => !isDisabled && toggleListing(listing)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm text-gray-900">{listing.title}</h5>
                    <p className="text-xs text-gray-600">{listing.addr}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm font-semibold text-blue-600">
                        ${listing.rent.toLocaleString()}/mo
                      </span>
                      <span className="text-sm text-gray-600">
                        D&I: {listing.di_score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {isSelected ? (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        isDisabled ? 'border-gray-300' : 'border-gray-400'
                      }`} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
