'use client';

import React, { useState } from 'react';
import { CurrencyConverter } from '@/components/international/CurrencyConverter';
import { CulturalTips } from '@/components/international/CulturalTips';
import { InternationalStudentDashboard } from '@/components/dashboard/InternationalStudentDashboard';
import { UserProfile } from '@/types';

export default function InternationalStudentPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'currency' | 'tips'>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Mock user profile for demo
  const mockProfile: UserProfile = {
    budget: 1200,
    max_rent: 1000,
    bedrooms: 1,
    bathrooms: 1,
    accessibility_needs: ['wheelchair', 'elevator'],
    commute_preferences: {
      max_walk_time: 15,
      max_bus_frequency: 30,
      winter_penalty: false
    },
    inclusivity_needs: {
      international_student: true,
      no_ssn: true,
      needs_cosigner: true
    },
    language: 'en',
    pet_friendly: false,
    smoking_allowed: false
  };

  const mockSavedListings = [
    {
      id: '1',
      title: 'Cozy Studio Near Campus',
      addr: '123 Main St, Blacksburg, VA',
      rent: 850,
      avg_utils: 100,
      deposit: 1700,
      lat: 37.2296,
      lng: -80.4139,
      step_free: true,
      elevator: false,
      doorway_width_cm: 32,
      acc_bath: true,
      acc_parking: false,
      mgmt_hours_late: '9-17',
      well_lit: true,
      dist_to_campus_km: 1.2,
      walk_min: 12,
      bus_headway_min: 15,
      accepts_international: true,
      no_ssn_ok: true,
      cosigner_ok: true,
      anti_disc_policy: true,
      incl_utils: false,
      di_score: 85,
      subscores: {
        affordability: 80,
        accessibility: 90,
        safety: 85,
        commute: 80,
        inclusivity: 95
      }
    }
  ];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'currency', name: 'Currency Converter', icon: '💱' },
    { id: 'tips', name: 'Cultural Tips', icon: '🌍' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            International Student Resources
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Everything you need to navigate US housing as an international student
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <InternationalStudentDashboard
              profile={userProfile || mockProfile}
              savedListings={mockSavedListings}
            />
          )}

          {activeTab === 'currency' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrencyConverter />
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Currency Tips</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Exchange Rate Monitoring</h4>
                    <p className="text-sm text-blue-800">
                      Monitor exchange rates regularly as they can fluctuate significantly. 
                      Consider using apps like XE or OANDA for real-time rates.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Budget Planning</h4>
                    <p className="text-sm text-green-800">
                      Always budget in your home currency first, then convert to USD. 
                      This helps you understand the true cost in familiar terms.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Banking Tips</h4>
                    <p className="text-sm text-yellow-800">
                      Consider opening a US bank account to avoid foreign transaction fees. 
                      Many banks offer special accounts for international students.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <CulturalTips />
          )}
        </div>

        {/* Quick Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need More Help?</h3>
            <p className="text-gray-600 mb-4">
              Our international student support team is here to help you navigate US housing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium min-h-[44px]">
                📞 Contact Support
              </button>
              <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium min-h-[44px]">
                💬 Live Chat
              </button>
              <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium min-h-[44px]">
                📚 Resource Library
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
