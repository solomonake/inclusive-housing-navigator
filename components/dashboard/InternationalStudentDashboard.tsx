'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, Listing } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface InternationalStudentDashboardProps {
  profile: UserProfile;
  savedListings: Listing[];
  className?: string;
}

export const InternationalStudentDashboard: React.FC<InternationalStudentDashboardProps> = ({
  profile,
  savedListings,
  className = ''
}) => {
  const [searchProgress, setSearchProgress] = useState({
    totalSearches: 0,
    listingsViewed: 0,
    applicationsSubmitted: 0,
    interviewsScheduled: 0
  });

  const [budgetStatus, setBudgetStatus] = useState({
    monthlyBudget: profile.budget,
    currentSpent: 0,
    remainingBudget: profile.budget,
    averageRent: 0
  });

  const [culturalTips, setCulturalTips] = useState([
    {
      id: 1,
      title: "Understanding US Rental Terms",
      description: "Learn about security deposits, first/last month rent, and application fees",
      icon: "📚",
      completed: false
    },
    {
      id: 2,
      title: "Building Credit History",
      description: "Start building credit with a secured credit card or co-signer",
      icon: "💳",
      completed: false
    },
    {
      id: 3,
      title: "Cultural Housing Norms",
      description: "Understand roommate expectations and shared living arrangements",
      icon: "🏠",
      completed: false
    },
    {
      id: 4,
      title: "Transportation Planning",
      description: "Research public transit options and walking distances to campus",
      icon: "🚌",
      completed: false
    }
  ]);

  useEffect(() => {
    // Calculate average rent from saved listings
    if (savedListings.length > 0) {
      const avgRent = savedListings.reduce((sum, listing) => sum + listing.rent, 0) / savedListings.length;
      setBudgetStatus(prev => ({
        ...prev,
        averageRent: avgRent
      }));
    }
  }, [savedListings]);

  const getBudgetStatusColor = () => {
    const ratio = budgetStatus.averageRent / budgetStatus.monthlyBudget;
    if (ratio <= 0.7) return 'text-green-600';
    if (ratio <= 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBudgetStatusText = () => {
    const ratio = budgetStatus.averageRent / budgetStatus.monthlyBudget;
    if (ratio <= 0.7) return 'Excellent budget fit';
    if (ratio <= 0.9) return 'Good budget fit';
    return 'Consider increasing budget';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">🌍</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome, International Student!</h2>
            <p className="text-gray-600">Your personalized housing search dashboard</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Listings</p>
                <p className="text-2xl font-bold text-blue-600">{savedListings.length}</p>
              </div>
              <div className="text-2xl">💾</div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Status</p>
                <p className={`text-lg font-bold ${getBudgetStatusColor()}`}>
                  {getBudgetStatusText()}
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Search Progress</p>
                <p className="text-2xl font-bold text-green-600">{searchProgress.totalSearches}</p>
              </div>
              <div className="text-2xl">🔍</div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-purple-600">{searchProgress.applicationsSubmitted}</p>
              </div>
              <div className="text-2xl">📝</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>💰</span>
            <span>Budget Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Budget</p>
                <p className="text-2xl font-bold text-gray-900">${budgetStatus.monthlyBudget.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Rent</p>
                <p className="text-2xl font-bold text-blue-600">${budgetStatus.averageRent.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(budgetStatus.monthlyBudget - budgetStatus.averageRent).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Budget Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Factor in utilities, internet, and other monthly expenses</li>
                <li>• Consider currency exchange rate fluctuations</li>
                <li>• Budget for security deposits (usually 1-2 months rent)</li>
                <li>• Set aside emergency funds for unexpected expenses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cultural Tips & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🌍</span>
            <span>Cultural Tips & Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {culturalTips.map((tip) => (
              <div
                key={tip.id}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  tip.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => {
                  setCulturalTips(prev =>
                    prev.map(t => t.id === tip.id ? { ...t, completed: !t.completed } : t)
                  );
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{tip.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    tip.completed
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {tip.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⚡</span>
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-medium text-gray-900">Search Listings</h4>
              <p className="text-sm text-gray-600">Find new housing options</p>
            </button>
            
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="text-2xl mb-2">💾</div>
              <h4 className="font-medium text-gray-900">View Saved</h4>
              <p className="text-sm text-gray-600">Review saved listings</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="text-2xl mb-2">📄</div>
              <h4 className="font-medium text-gray-900">Lease Help</h4>
              <p className="text-sm text-gray-600">Get lease assistance</p>
            </button>
            
            <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
              <div className="text-2xl mb-2">❓</div>
              <h4 className="font-medium text-gray-900">Get Help</h4>
              <p className="text-sm text-gray-600">Contact support</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
