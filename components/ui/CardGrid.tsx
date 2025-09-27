import React from 'react';
import { Listing } from '@/types';
import { ListingCard } from './ListingCard';

interface CardGridProps {
  listings: Listing[];
  onViewDetails: (listing: Listing) => void;
  onSaveListing?: (listing: Listing) => void;
  savedListings?: Set<number>;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({ 
  listings, 
  onViewDetails, 
  onSaveListing,
  savedListings = new Set(),
  className = ''
}) => {
  if (listings.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-lg font-semibold text-[hsl(var(--fg))] mb-2">
          No listings found
        </h3>
        <p className="text-[hsl(var(--fg-muted))]">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onViewDetails={onViewDetails}
          onSaveListing={onSaveListing}
          isSaved={savedListings.has(listing.id)}
        />
      ))}
    </div>
  );
};
