import React from 'react';
import { Listing } from '@/types';
import { ScoreChip } from './ScoreChip';

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
  onSaveListing?: (listing: Listing) => void;
  isSaved?: boolean;
  className?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onViewDetails, 
  onSaveListing,
  isSaved = false,
  className = ''
}) => {
  const totalMonthlyCost = listing.rent + listing.avg_utils + (listing.deposit / 12);

  return (
    <div className={`card p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[hsl(var(--fg))] mb-1">
            {listing.title}
          </h3>
          <p className="text-sm text-[hsl(var(--fg-muted))] mb-2">
            {listing.addr}
          </p>
        </div>
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-[hsl(var(--positive))]">
            ${listing.rent.toLocaleString()}
          </div>
          <div className="text-sm text-[hsl(var(--fg-muted))]">/month</div>
        </div>
      </div>

      {/* D&I Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-[hsl(var(--fg))]">D&I Score:</span>
          <span className="text-lg font-bold text-[hsl(var(--accent))]">
            {listing.di_score.toFixed(1)}
          </span>
        </div>
        <div className="text-sm text-[hsl(var(--fg-muted))]">
          Total: ${totalMonthlyCost.toLocaleString()}/mo
        </div>
      </div>

      {/* Subscore Chips */}
      <div className="flex flex-wrap gap-1 mb-4">
        <ScoreChip type="affordability" score={listing.subscores.affordability} />
        <ScoreChip type="accessibility" score={listing.subscores.accessibility} />
        <ScoreChip type="safety" score={listing.subscores.safety} />
        <ScoreChip type="commute" score={listing.subscores.commute} />
        <ScoreChip type="inclusivity" score={listing.subscores.inclusivity} />
      </div>

      {/* Inclusivity Badges */}
      <div className="flex flex-wrap gap-1 mb-4">
        {listing.accepts_international && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            🌍 International
          </span>
        )}
        {listing.no_ssn_ok && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            📄 No SSN OK
          </span>
        )}
        {listing.cosigner_ok && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            👥 Co-signer OK
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onViewDetails(listing)}
          className="btn-primary flex-1"
          aria-label={`View details for ${listing.title}`}
        >
          View Details
        </button>
        {onSaveListing && (
          <button
            onClick={() => onSaveListing(listing)}
            className={`btn-secondary px-3 ${
              isSaved ? 'bg-red-50 text-red-600 border-red-200' : ''
            }`}
            aria-label={isSaved ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        )}
        <button
          className="btn-secondary"
          aria-label={`Analyze lease for ${listing.title}`}
        >
          📄 Lease QA
        </button>
      </div>
    </div>
  );
};
