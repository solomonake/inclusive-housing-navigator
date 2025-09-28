'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, LineChart, Line, Legend } from 'recharts';
import { Listing } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, MapPin, Accessibility, BarChart3, PieChart as PieChartIcon, Target as ScatterChartIcon, RefreshCw } from 'lucide-react';
import { ensureArray, nonEmpty } from '@/lib/utils/safe';
import { AriaLive } from '@/components/accessibility/aria-live';

export default function ChartsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ariaMessage, setAriaMessage] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    setError('');
    setAriaMessage('Loading housing data...');
    try {
      const response = await fetch('/api/listings');
      const payload = await response.json().catch(() => ({}));
      const listings: Listing[] = ensureArray(payload?.listings);
      
      if (nonEmpty(listings)) {
        setListings(listings);
        setAriaMessage(`Loaded ${listings.length} listings for analysis`);
      } else {
        setError('No listings data available');
        setAriaMessage('No listings data available');
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      setError('Failed to load listings data');
      setAriaMessage('Failed to load listings data');
    } finally {
      setLoading(false);
    }
  };

  // Chart 1: Price Distribution Bar Chart
  const getPriceDistributionData = () => {
    if (!nonEmpty(listings)) return [];
    
    const priceRanges = [
      { range: '$0-500', min: 0, max: 500, count: 0, color: '#3B82F6' },
      { range: '$501-750', min: 501, max: 750, count: 0, color: '#10B981' },
      { range: '$751-1000', min: 751, max: 1000, count: 0, color: '#F59E0B' },
      { range: '$1001-1250', min: 1001, max: 1250, count: 0, color: '#EF4444' },
      { range: '$1251+', min: 1251, max: Infinity, count: 0, color: '#8B5CF6' }
    ];

    listings.forEach(listing => {
      const range = priceRanges.find(r => listing.rent >= r.min && listing.rent <= r.max);
      if (range) {
        range.count++;
      }
    });

    return priceRanges.map(({ range, count, color }) => ({ name: range, value: count, color }));
  };

  // Chart 2: D&I Score Pie Chart
  const getDiversityScoreData = () => {
    if (!nonEmpty(listings)) return [];
    
    const scoreRanges = [
      { range: 'Excellent (80-100)', min: 80, max: 100, count: 0, color: '#10B981' },
      { range: 'Good (60-79)', min: 60, max: 79, count: 0, color: '#84CC16' },
      { range: 'Fair (40-59)', min: 40, max: 59, count: 0, color: '#F59E0B' },
      { range: 'Poor (0-39)', min: 0, max: 39, count: 0, color: '#EF4444' }
    ];

    listings.forEach(listing => {
      const range = scoreRanges.find(r => listing.di_score >= r.min && listing.di_score <= r.max);
      if (range) {
        range.count++;
      }
    });

    return scoreRanges.map(({ range, count, color }) => ({ name: range, value: count, color }));
  };

  // Chart 3: Price vs Distance Scatter Plot
  const getPriceDistanceData = () => {
    if (!nonEmpty(listings)) return [];
    
    return listings.slice(0, 20).map(listing => ({
      x: listing.dist_to_campus_km || 0,
      y: listing.rent || 0,
      di_score: listing.di_score || 0,
      name: (listing.title || 'Unknown').substring(0, 20) + '...'
    }));
  };

  // Chart 4: Accessibility Features Analysis
  const getAccessibilityData = () => {
    if (!nonEmpty(listings)) return [];
    
    const features = ['step_free', 'elevator', 'acc_bath', 'acc_parking'];
    const featureNames = ['Step Free Access', 'Elevator', 'Accessible Bathroom', 'Accessible Parking'];
    
    return features.map((feature, index) => ({
      name: featureNames[index],
      count: listings.filter(listing => listing[feature as keyof Listing]).length,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index]
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 border border-white/20 rounded-xl shadow-lg backdrop-blur-md">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-3 border border-white/20 rounded-xl shadow-lg backdrop-blur-md">
          <p className="font-medium text-white">{data.name}</p>
          <p className="text-sm text-blue-600">Distance: {data.x} km</p>
          <p className="text-sm text-green-600">Rent: ${data.y}</p>
          <p className="text-sm text-purple-600">D&I Score: {data.di_score}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-radial bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AriaLive message="Loading housing data..." />
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading housing data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !nonEmpty(listings)) {
    return (
      <div className="min-h-screen py-8 bg-radial bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AriaLive message={error || 'No data available'} assertive />
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No Data Available</h3>
            <p className="text-white/70 mb-6">
              {error || 'No housing data available for visualization.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={loadListings} variant="gradient" disabled={loading}>
                <TrendingUp className="w-4 h-4 mr-2" />
                {loading ? 'Loading...' : 'Retry Loading Data'}
              </Button>
              <Button onClick={() => window.location.href = '/listings'} variant="glass">
                <MapPin className="w-4 h-4 mr-2" />
                Go to Listings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-radial bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AriaLive message={ariaMessage} />
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white text-shadow mb-2">
                Housing Analytics Dashboard
              </h1>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                AI-powered insights and visualizations from your housing data
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{listings?.length || 0}</p>
                  <p className="text-white/70 text-sm">Total Properties</p>
                </div>
              </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  ${nonEmpty(listings) ? Math.round(listings.reduce((sum, l) => sum + (l.rent || 0), 0) / listings.length) : 0}
                </p>
                <p className="text-white/70 text-sm">Avg Rent</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Accessibility className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {nonEmpty(listings) ? Math.round(listings.reduce((sum, l) => sum + (l.di_score || 0), 0) / listings.length) : 0}
                </p>
                <p className="text-white/70 text-sm">Avg D&I Score</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {nonEmpty(listings) ? Math.round(listings.reduce((sum, l) => sum + (l.dist_to_campus_km || 0), 0) / listings.length * 10) / 10 : 0}
                </p>
                <p className="text-white/70 text-sm">Avg Distance (km)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Row 1: Price Distribution & D&I Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Distribution */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                  Rent Price Distribution
                </CardTitle>
                <p className="text-white/60 text-sm">Distribution of rental prices across all listings</p>
              </CardHeader>
              <CardContent>
                {getPriceDistributionData().length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getPriceDistributionData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {getPriceDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60">No price data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* D&I Score Distribution */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2 text-green-400" />
                  Diversity & Inclusion Scores
                </CardTitle>
                <p className="text-white/60 text-sm">Distribution of D&I scores across all properties</p>
              </CardHeader>
              <CardContent>
                {getDiversityScoreData().length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getDiversityScoreData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {getDiversityScoreData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <PieChartIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60">No score data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Price vs Distance Scatter */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <ScatterChartIcon className="w-5 h-5 mr-2 text-purple-400" />
                Price vs Distance Analysis
              </CardTitle>
              <p className="text-white/60 text-sm">Relationship between rental price and distance to campus</p>
            </CardHeader>
            <CardContent>
              {getPriceDistanceData().length > 0 ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={getPriceDistanceData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Distance (km)"
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Rent ($)"
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <Tooltip content={<ScatterTooltip />} />
                      <Scatter dataKey="y" fill="#8B5CF6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <ScatterChartIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No location data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Row 3: Accessibility Features */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Accessibility className="w-5 h-5 mr-2 text-yellow-400" />
                Accessibility Features Availability
              </CardTitle>
              <p className="text-white/60 text-sm">Number of properties with each accessibility feature</p>
            </CardHeader>
            <CardContent>
              {getAccessibilityData().length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getAccessibilityData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {getAccessibilityData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <Accessibility className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No accessibility data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="mt-8 p-6">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
              Key Insights
            </CardTitle>
            <p className="text-white/60 text-sm">Data-driven insights from the housing market analysis</p>
          </CardHeader>
          <CardContent>
            {nonEmpty(listings) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="font-semibold text-blue-300 mb-2">💰 Price Insights</h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Average rent: ${Math.round(listings.reduce((sum, l) => sum + l.rent, 0) / listings.length)}</li>
                  <li>• Price range: ${Math.min(...listings.map(l => l.rent))} - ${Math.max(...listings.map(l => l.rent))}</li>
                  <li>• Most common price range: {getPriceDistributionData().length > 0 ? getPriceDistributionData().reduce((max, item) => item.value > max.value ? item : max).name : 'N/A'}</li>
                </ul>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <h4 className="font-semibold text-green-300 mb-2">♿ Accessibility</h4>
                <ul className="text-sm text-green-200 space-y-1">
                  <li>• Properties with step-free access: {listings.filter(l => l.step_free).length}</li>
                  <li>• Properties with elevators: {listings.filter(l => l.elevator).length}</li>
                  <li>• Accessible bathrooms: {listings.filter(l => l.acc_bath).length}</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <h4 className="font-semibold text-purple-300 mb-2">📍 Location</h4>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• Average distance to campus: {Math.round(listings.reduce((sum, l) => sum + l.dist_to_campus_km, 0) / listings.length * 10) / 10} km</li>
                  <li>• Walkable properties (≤15 min): {listings.filter(l => (l.walk_min || 0) <= 15).length}</li>
                  <li>• International friendly: {listings.filter(l => l.accepts_international).length}</li>
                </ul>
              </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No data available for insights</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}