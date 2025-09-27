import React from 'react';
import { Listing } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoreChip } from './ScoreChip';
import { ScoreDonut } from './ScoreDonut';
import { Heart, FileText, MapPin, DollarSign, Users, Shield, Bus, Globe } from 'lucide-react';

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
  const totalMonthlyCost = listing.rent + (listing.avg_utils || 0) + ((listing.deposit || 0) / 12);

  return (
    <Card className={`group hover:scale-105 motion-safe:transition-all duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 text-white">
              {listing.title}
            </CardTitle>
            <div className="flex items-center text-white/70 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              {listing.addr}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-1" />
              {listing.rent.toLocaleString()}
            </div>
            <div className="text-sm text-white/60">/month</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* D&I Score with Donut */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ScoreDonut score={listing.di_score} size="sm" />
            <div>
              <div className="text-sm font-medium text-white">D&I Score</div>
              <div className="text-xs text-white/60">Total: ${totalMonthlyCost.toLocaleString()}/mo</div>
            </div>
          </div>
        </div>

        {/* Subscore Chips */}
        <div className="flex flex-wrap gap-2">
          <ScoreChip type="affordability" score={listing.subscores?.affordability || 0} size="sm" />
          <ScoreChip type="accessibility" score={listing.subscores?.accessibility || 0} size="sm" />
          <ScoreChip type="safety" score={listing.subscores?.safety || 0} size="sm" />
          <ScoreChip type="commute" score={listing.subscores?.commute || 0} size="sm" />
          <ScoreChip type="inclusivity" score={listing.subscores?.inclusivity || 0} size="sm" />
        </div>

        {/* Inclusivity Badges */}
        <div className="flex flex-wrap gap-2">
          {listing.accepts_international && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
              <Globe className="w-3 h-3 mr-1" />
              International
            </div>
          )}
          {listing.no_ssn_ok && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
              <FileText className="w-3 h-3 mr-1" />
              No SSN OK
            </div>
          )}
          {listing.cosigner_ok && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
              <Users className="w-3 h-3 mr-1" />
              Co-signer OK
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            {listing.well_lit ? 'Well Lit' : 'Poor Lighting'}
          </div>
          <div className="flex items-center">
            <Bus className="w-3 h-3 mr-1" />
            {listing.bus_headway_min ? `${listing.bus_headway_min}min bus` : 'No bus info'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
          <Button
            onClick={() => onViewDetails(listing)}
            className="flex-1"
            size="sm"
          >
            View Details
          </Button>
          <div className="flex space-x-2">
            {onSaveListing && (
              <Button
                onClick={() => onSaveListing(listing)}
                variant={isSaved ? "destructive" : "glass"}
                size="sm"
                className="px-3"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            )}
            <Button
              variant="glass"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <FileText className="w-4 h-4 mr-1" />
              Lease QA
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};