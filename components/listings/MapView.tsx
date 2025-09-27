'use client';

import React, { useState, useEffect } from 'react';
import { Listing } from '@/types';

interface MapViewProps {
  listings: Listing[];
  selectedListing?: Listing;
  onListingSelect?: (listing: Listing) => void;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({ 
  listings, 
  selectedListing, 
  onListingSelect,
  className = '' 
}) => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // For demo purposes, we'll show a placeholder map
  // In a real implementation, you would integrate with Google Maps, Mapbox, or similar
  const defaultCenter = { lat: 37.2296, lng: -80.4139 }; // Virginia Tech coordinates

  const toggleMapView = () => {
    setIsMapVisible(!isMapVisible);
  };

  const getMapUrl = () => {
    // Generate a static map URL for demo purposes
    const markers = listings
      .filter(listing => listing.lat && listing.lng)
      .map(listing => `markers=color:blue%7C${listing.lat},${listing.lng}`)
      .join('&');
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${defaultCenter.lat},${defaultCenter.lng}&zoom=13&size=600x400&${markers}&key=YOUR_API_KEY`;
  };

  if (mapError) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
        <p className="text-gray-500 mb-4">Unable to load map view. Please try again later.</p>
        <button
          onClick={() => setMapError(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Toggle Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Location View</h3>
        <button
          onClick={toggleMapView}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <span>{isMapVisible ? 'Hide' : 'Show'} Map</span>
          <span className="text-lg">{isMapVisible ? '🗺️' : '📍'}</span>
        </button>
      </div>

      {/* Map Container */}
      {isMapVisible && (
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
              <p className="text-gray-600 mb-4">
                {listings.length} housing options found
              </p>
              <div className="text-sm text-gray-500">
                Map integration coming soon
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Summary */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Location Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Listings:</span>
            <span className="ml-2 font-medium">{listings.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Near Campus:</span>
            <span className="ml-2 font-medium">
              {listings.filter(l => l.dist_to_campus_km && l.dist_to_campus_km < 2).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Accessible:</span>
            <span className="ml-2 font-medium">
              {listings.filter(l => l.acc_bath || l.elevator || l.step_free).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">International Friendly:</span>
            <span className="ml-2 font-medium">
              {listings.filter(l => l.accepts_international).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};