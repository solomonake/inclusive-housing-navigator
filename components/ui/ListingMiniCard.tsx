'use client';

import React from 'react';
import { ScoreChip } from './ScoreChip';
import { HeartButton } from './HeartButton';
import { useCompareStore } from '@/lib/stores/compare';
import { Listing } from '@/types';

interface ListingMiniCardProps {
  listing: Listing;
}

export const ListingMiniCard: React.FC<ListingMiniCardProps> = ({ listing }) => {
  const { ids, toggle } = useCompareStore();
  const isInCompare = ids.includes(listing.id);

  const handleCompareToggle = () => {
    toggle(listing.id);
  };

  const handleScoreClick = () => {
    // Emit custom event for score explanation
    const event = new CustomEvent('open-score', { 
      detail: { listingId: listing.id } 
    });
    window.dispatchEvent(event);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalCost = listing.rent + (listing.avg_utils || 0);

  return (
    <article className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg">{listing.title}</h4>
          <p className="text-gray-600 text-sm">{listing.addr}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(listing.rent)}
          </div>
          <div className="text-xs text-gray-500">
            + {formatCurrency(listing.avg_utils || 0)} utils
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Total: {formatCurrency(totalCost)}</span>
          <span className="text-gray-500 ml-2">/month</span>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
            role="img"
            aria-label={`Diversity and Inclusion score: ${listing.di_score} out of 100`}
          >
            {listing.di_score}/100
          </div>
        </div>
      </div>

      {/* Score Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <ScoreChip 
          label="Affordability" 
          value={listing.subscores?.affordability || 0} 
          variant="indigo"
        />
        <ScoreChip 
          label="Accessibility" 
          value={listing.subscores?.accessibility || 0} 
          variant="emerald"
        />
        <ScoreChip 
          label="Inclusivity" 
          value={listing.subscores?.inclusivity || 0} 
          variant="purple"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleScoreClick}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 rounded px-2 py-1"
            aria-label={`Explain score breakdown for ${listing.title}`}
          >
            Why this score?
          </button>
          
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isInCompare}
              onChange={handleCompareToggle}
              className="h-4 w-4 text-blue-600 focus:ring-[var(--ring)] border-gray-300 rounded"
              aria-label={`${isInCompare ? 'Remove from' : 'Add to'} comparison list`}
            />
            <span className="ml-2">Compare</span>
          </label>
        </div>

        <HeartButton listingId={listing.id} />
      </div>
    </article>
  );
};
