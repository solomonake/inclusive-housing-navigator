'use client';

import React, { useEffect } from 'react';
import { Listing } from '@/types';
import { ScoreChip } from './ScoreChip';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, listing }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[hsl(var(--bg))] shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
            <h2 className="text-xl font-semibold text-[hsl(var(--fg))]">
              {listing.title}
            </h2>
            <button
              onClick={onClose}
              className="btn-secondary"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Score Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">D&I Score Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-2xl font-bold text-[hsl(var(--accent))]">
                      {listing.di_score.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <ScoreChip type="affordability" score={listing.subscores.affordability} />
                    <ScoreChip type="accessibility" score={listing.subscores.accessibility} />
                    <ScoreChip type="safety" score={listing.subscores.safety} />
                    <ScoreChip type="commute" score={listing.subscores.commute} />
                    <ScoreChip type="inclusivity" score={listing.subscores.inclusivity} />
                  </div>
                </div>
              </div>

              {/* Why This Score */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Why This Score?</h3>
                <div className="space-y-3 text-sm text-[hsl(var(--fg-muted))]">
                  <p>
                    <strong>Affordability ({listing.subscores.affordability.toFixed(1)}):</strong> 
                    Based on rent, utilities, and deposit requirements relative to typical student budgets.
                  </p>
                  <p>
                    <strong>Accessibility ({listing.subscores.accessibility.toFixed(1)}):</strong> 
                    Evaluates step-free entry, elevator access, doorway width, and accessible facilities.
                  </p>
                  <p>
                    <strong>Safety ({listing.subscores.safety.toFixed(1)}):</strong> 
                    Considers distance to campus, street lighting, and management availability.
                  </p>
                  <p>
                    <strong>Commute ({listing.subscores.commute.toFixed(1)}):</strong> 
                    Analyzes walk time, bus frequency, and proximity to essential services.
                  </p>
                  <p>
                    <strong>Inclusivity ({listing.subscores.inclusivity.toFixed(1)}):</strong> 
                    Assesses international student acceptance, SSN requirements, and anti-discrimination policies.
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Address:</span>
                    <p>{listing.addr}</p>
                  </div>
                  <div>
                    <span className="font-medium">Rent:</span>
                    <p>${listing.rent.toLocaleString()}/month</p>
                  </div>
                  <div>
                    <span className="font-medium">Utilities:</span>
                    <p>${listing.avg_utils.toLocaleString()}/month</p>
                  </div>
                  <div>
                    <span className="font-medium">Deposit:</span>
                    <p>${listing.deposit.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Distance to Campus:</span>
                    <p>{listing.dist_to_campus_km.toFixed(1)} km</p>
                  </div>
                  <div>
                    <span className="font-medium">Walk Time:</span>
                    <p>{listing.walk_min} minutes</p>
                  </div>
                </div>
              </div>

              {/* Accessibility Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Accessibility Features</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.step_free && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ♿ Step-free entry
                    </span>
                  )}
                  {listing.elevator && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🛗 Elevator
                    </span>
                  )}
                  {listing.acc_bath && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🚿 Accessible bathroom
                    </span>
                  )}
                  {listing.acc_parking && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🅿️ Accessible parking
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
