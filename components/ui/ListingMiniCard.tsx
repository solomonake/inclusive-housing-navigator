import React from 'react';
import { ScoreDonut } from './ScoreDonut';
import { ScoreChip } from './ScoreChip';
import { HeartButton } from './HeartButton';
import { CompareCheckbox } from './CompareCheckbox';
import { Listing } from '@/types';

interface ListingMiniCardProps {
  listing: Listing;
}

export const ListingMiniCard: React.FC<ListingMiniCardProps> = ({ listing }) => {
  const handleWhyScoreClick = () => {
    // Emit a custom event that the parent page can listen to
    const event = new CustomEvent('open-score', { 
      detail: { listingId: listing.id, listing } 
    });
    window.dispatchEvent(event);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 group">
      {/* Header */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {listing.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1" aria-label={`Address: ${listing.addr}`}>
          {listing.addr}
        </p>
      </div>

      {/* Cost and Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white" aria-label={`Monthly cost: ${formatCurrency(listing.rent)} plus estimated utilities ${formatCurrency(listing.avg_utils || 0)}`}>
            {formatCurrency(listing.rent)}
            {listing.avg_utils && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                + {formatCurrency(listing.avg_utils)} est. utils
              </span>
            )}
          </p>
        </div>
        <ScoreDonut 
          value={listing.di_score} 
          label="D&I" 
          size="sm"
          colorClass="stroke-blue-600"
        />
      </div>

      {/* Score Chips */}
      {listing.subscores && (
        <div className="flex flex-wrap gap-2 mb-4">
          <ScoreChip 
            type="affordability"
            score={listing.subscores.affordability}
            label="Affordability" 
            variant="indigo" 
          />
          <ScoreChip 
            type="accessibility"
            score={listing.subscores.accessibility}
            label="Accessibility" 
            variant="emerald" 
          />
          <ScoreChip 
            type="inclusivity"
            score={listing.subscores.inclusivity}
            label="Inclusivity" 
            variant="purple" 
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleWhyScoreClick}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
          aria-label={`Why this D&I score for ${listing.title}?`}
        >
          Why this score?
        </button>
        
        <div className="flex items-center gap-2">
          <HeartButton listingId={listing.id} />
          <CompareCheckbox listingId={listing.id} />
        </div>
      </div>
    </div>
  );
};