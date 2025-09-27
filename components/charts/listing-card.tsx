'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScoredListing } from '@/types';
import { cn, formatCurrency, formatScore, getScoreColor, getTierColor, formatDistance, formatDuration } from '@/lib/utils';
import { MapPin, Bed, Bath, Square, Clock, Bus, Users, Shield, Heart } from 'lucide-react';

interface ListingCardProps {
  listing: ScoredListing;
  onViewDetails: (listing: ScoredListing) => void;
  onSaveListing?: (listing: ScoredListing) => void;
  isSaved?: boolean;
  className?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onViewDetails, 
  onSaveListing,
  isSaved = false,
  className 
}) => {
  const totalMonthlyCost = listing.rent + listing.utilities + (listing.deposits / 12);

  return (
    <Card className={cn('w-full hover:shadow-lg transition-shadow duration-200', className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {listing.name}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">{listing.address}</span>
            </CardDescription>
          </div>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(listing.rent)}
            </div>
            <div className="text-sm text-gray-500">/month</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* D&I Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">D&I Score:</span>
              <span className={cn('text-lg font-bold', getScoreColor(listing.di_score.overall))}>
                {formatScore(listing.di_score.overall)}
              </span>
            </div>
            <Badge className={getTierColor(listing.di_score.tier)}>
              {listing.di_score.tier}
            </Badge>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4 text-gray-500" />
              <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4 text-gray-500" />
              <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="w-4 h-4 text-gray-500" />
              <span>{listing.sqft} sqft</span>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium mb-2">Monthly Cost Breakdown</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Rent:</span>
                <span>{formatCurrency(listing.rent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Utilities:</span>
                <span>{formatCurrency(listing.utilities)}</span>
              </div>
              <div className="flex justify-between">
                <span>Deposits (prorated):</span>
                <span>{formatCurrency(listing.deposits / 12)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total:</span>
                <span>{formatCurrency(totalMonthlyCost)}</span>
              </div>
            </div>
          </div>

          {/* Accessibility & Features */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Key Features</div>
            <div className="flex flex-wrap gap-1">
              {listing.step_free_entry && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Step-free
                </Badge>
              )}
              {listing.elevator && (
                <Badge variant="outline" className="text-xs">
                  Elevator
                </Badge>
              )}
              {listing.accessible_bathroom && (
                <Badge variant="outline" className="text-xs">
                  Accessible Bath
                </Badge>
              )}
              {listing.pet_friendly && (
                <Badge variant="outline" className="text-xs">
                  Pet-friendly
                </Badge>
              )}
              {listing.accepts_international && (
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  International
                </Badge>
              )}
            </div>
          </div>

          {/* Commute Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{formatDuration(listing.walk_time)} walk</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bus className="w-4 h-4 text-gray-500" />
              <span>{listing.bus_frequency}min bus</span>
            </div>
          </div>

          {/* Distance */}
          <div className="text-sm text-gray-600">
            {formatDistance(listing.distance_to_campus)} from campus
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={() => onViewDetails(listing)}
              className="flex-1"
              aria-label={`View details for ${listing.name}`}
            >
              View Details
            </Button>
            {onSaveListing && (
              <Button
                variant="outline"
                onClick={() => onSaveListing(listing)}
                className={cn(
                  'px-3',
                  isSaved ? 'bg-red-50 text-red-600 border-red-200' : ''
                )}
                aria-label={isSaved ? `Remove ${listing.name} from saved` : `Save ${listing.name}`}
              >
                <Heart className={cn('w-4 h-4', isSaved ? 'fill-current' : '')} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
