'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Listing } from '@/types'
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Shield,
  Accessibility
} from 'lucide-react'
import Link from 'next/link'

// Simple listing card component
const ListingCard = ({ listing }: { listing: Listing }) => {
  const [isLiked, setIsLiked] = useState(false)
  
  return (
    <div className="group cursor-pointer">
      <div className="relative">
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600">Property Image</p>
            </div>
          </div>
        </div>
        
        {/* Like button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsLiked(!isLiked)
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
          />
        </button>
        
        {/* D&I Score badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-900 font-semibold">
            {Math.round(listing.di_score || 0)}/100
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">
            {listing.title || 'Property Name'}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 truncate">
          {listing.addr || 'Property Address'}
        </p>
        
        <p className="text-sm text-gray-600">
          {listing.bedrooms || 1} bed • {listing.bathrooms || 1} bath
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900">
              ${listing.rent || 0}
            </span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          
          {/* Accessibility indicator */}
          {listing.step_free && (
            <div className="flex items-center gap-1 text-green-600">
              <Accessibility className="w-4 h-4" />
              <span className="text-xs">Accessible</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Filter bar component
const FilterBar = ({ 
  onFiltersChange, 
  currentFilters 
}: { 
  onFiltersChange: (filters: any) => void
  currentFilters: any 
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([500, 3000])
  const [bedrooms, setBedrooms] = useState('any')
  const [accessibility, setAccessibility] = useState(false)
  const [safety, setSafety] = useState(false)
  const [inclusivity, setInclusivity] = useState(false)

  const applyFilters = () => {
    const filters = {
      maxRent: priceRange[1],
      minRent: priceRange[0],
      bedrooms: bedrooms !== 'any' ? parseInt(bedrooms) : undefined,
      accessibility,
      safety,
      inclusivity
    }
    onFiltersChange(filters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setPriceRange([500, 3000])
    setBedrooms('any')
    setAccessibility(false)
    setSafety(false)
    setInclusivity(false)
    onFiltersChange({})
  }

  const quickFilters = [
    { label: 'Under $1000', value: { maxRent: 1000 } },
    { label: '1-2 Bedrooms', value: { bedrooms: 2 } },
    { label: 'Accessible', value: { accessibility: true } },
    { label: 'High Safety', value: { safety: true } },
    { label: 'International Friendly', value: { inclusivity: true } },
  ]

  return (
    <div className="border-b border-gray-200">
      {/* Quick Filters */}
      <div className="flex items-center gap-4 px-6 py-4 overflow-x-auto">
        {quickFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => onFiltersChange(filter.value)}
            className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-900 transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-medium">{filter.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-900 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">All Filters</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="any">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            {/* Accessibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessibility}
                    onChange={(e) => setAccessibility(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Accessible</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={safety}
                    onChange={(e) => setSafety(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">High Safety</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inclusivity}
                    onChange={(e) => setInclusivity(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">International Friendly</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-end space-y-2">
              <Button onClick={applyFilters} className="w-full">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<any>({})

  const applyFilters = (listings: Listing[], filters: any) => {
    return listings.filter(listing => {
      // Price filter
      if (filters.maxRent && listing.rent > filters.maxRent) return false
      if (filters.minRent && listing.rent < filters.minRent) return false
      
      // Bedrooms filter
      if (filters.bedrooms && listing.bedrooms !== filters.bedrooms) return false
      
      // Accessibility filter
      if (filters.accessibility && !listing.step_free && !listing.elevator) return false
      
      // Safety filter
      if (filters.safety && (!listing.well_lit || (listing.dist_to_campus_km || 0) > 2)) return false
      
      // Inclusivity filter
      if (filters.inclusivity && !listing.accepts_international) return false
      
      return true
    })
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    const filtered = applyFilters(listings, newFilters)
    setFilteredListings(filtered)
  }

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/listings')
        
        if (response.ok) {
          const data = await response.json()
          const listingsData = data.listings || []
          setListings(listingsData)
          setFilteredListings(listingsData)
        } else {
          // Fallback to mock data
          const mockListings: Listing[] = [
            {
              id: '1',
              title: 'Modern Studio Apartment',
              addr: '123 University Ave, Blacksburg, VA',
              rent: 1200,
              avg_utils: 150,
              deposit: 1200,
              bedrooms: 1,
              bathrooms: 1,
              step_free: true,
              elevator: true,
              doorway_width_cm: 91,
              acc_bath: true,
              acc_parking: true,
              well_lit: true,
              dist_to_campus_km: 0.5,
              walk_min: 8,
              bus_headway_min: 10,
              accepts_international: true,
              no_ssn_ok: true,
              cosigner_ok: true,
              anti_disc_policy: true,
              di_score: 85,
              subscores: {
                affordability: 80,
                accessibility: 90,
                safety: 85,
                commute: 80,
                inclusivity: 90
              }
            },
            {
              id: '2',
              title: 'Cozy 2-Bedroom House',
              addr: '456 Main St, Blacksburg, VA',
              rent: 1800,
              avg_utils: 200,
              deposit: 1800,
              bedrooms: 2,
              bathrooms: 2,
              step_free: false,
              elevator: false,
              doorway_width_cm: 81,
              acc_bath: false,
              acc_parking: true,
              well_lit: true,
              dist_to_campus_km: 1.2,
              walk_min: 15,
              bus_headway_min: 15,
              accepts_international: true,
              no_ssn_ok: false,
              cosigner_ok: true,
              anti_disc_policy: true,
              di_score: 72,
              subscores: {
                affordability: 70,
                accessibility: 60,
                safety: 80,
                commute: 70,
                inclusivity: 80
              }
            },
            {
              id: '3',
              title: 'Luxury Apartment Complex',
              addr: '789 College Dr, Blacksburg, VA',
              rent: 2200,
              avg_utils: 250,
              deposit: 2200,
              bedrooms: 3,
              bathrooms: 2,
              step_free: true,
              elevator: true,
              doorway_width_cm: 91,
              acc_bath: true,
              acc_parking: true,
              well_lit: true,
              dist_to_campus_km: 0.8,
              walk_min: 10,
              bus_headway_min: 8,
              accepts_international: true,
              no_ssn_ok: true,
              cosigner_ok: true,
              anti_disc_policy: true,
              di_score: 92,
              subscores: {
                affordability: 85,
                accessibility: 95,
                safety: 90,
                commute: 85,
                inclusivity: 95
              }
            },
            {
              id: '4',
              title: 'Budget-Friendly Room',
              addr: '321 Student St, Blacksburg, VA',
              rent: 800,
              avg_utils: 100,
              deposit: 800,
              bedrooms: 1,
              bathrooms: 1,
              step_free: true,
              elevator: false,
              doorway_width_cm: 76,
              acc_bath: false,
              acc_parking: false,
              well_lit: false,
              dist_to_campus_km: 2.0,
              walk_min: 25,
              bus_headway_min: 20,
              accepts_international: false,
              no_ssn_ok: false,
              cosigner_ok: false,
              anti_disc_policy: false,
              di_score: 45,
              subscores: {
                affordability: 90,
                accessibility: 30,
                safety: 40,
                commute: 30,
                inclusivity: 30
              }
            },
            {
              id: '5',
              title: 'Family Home with Garden',
              addr: '555 Oak St, Blacksburg, VA',
              rent: 1600,
              avg_utils: 180,
              deposit: 1600,
              bedrooms: 3,
              bathrooms: 2,
              step_free: false,
              elevator: false,
              doorway_width_cm: 81,
              acc_bath: true,
              acc_parking: true,
              well_lit: true,
              dist_to_campus_km: 1.5,
              walk_min: 20,
              bus_headway_min: 12,
              accepts_international: true,
              no_ssn_ok: true,
              cosigner_ok: true,
              anti_disc_policy: true,
              di_score: 78,
              subscores: {
                affordability: 75,
                accessibility: 70,
                safety: 85,
                commute: 75,
                inclusivity: 85
              }
            },
            {
              id: '6',
              title: 'Downtown Loft',
              addr: '999 Business Blvd, Blacksburg, VA',
              rent: 1400,
              avg_utils: 160,
              deposit: 1400,
              bedrooms: 2,
              bathrooms: 1,
              step_free: true,
              elevator: true,
              doorway_width_cm: 86,
              acc_bath: true,
              acc_parking: false,
              well_lit: true,
              dist_to_campus_km: 1.0,
              walk_min: 12,
              bus_headway_min: 10,
              accepts_international: true,
              no_ssn_ok: true,
              cosigner_ok: true,
              anti_disc_policy: true,
              di_score: 82,
              subscores: {
                affordability: 80,
                accessibility: 85,
                safety: 80,
                commute: 80,
                inclusivity: 85
              }
            },
            {
              id: '7',
              title: 'Budget Studio',
              addr: '100 Cheap St, Blacksburg, VA',
              rent: 600,
              avg_utils: 80,
              deposit: 600,
              bedrooms: 1,
              bathrooms: 1,
              step_free: false,
              elevator: false,
              doorway_width_cm: 70,
              acc_bath: false,
              acc_parking: false,
              well_lit: false,
              dist_to_campus_km: 3.0,
              walk_min: 30,
              bus_headway_min: 30,
              accepts_international: false,
              no_ssn_ok: false,
              cosigner_ok: false,
              anti_disc_policy: false,
              di_score: 35,
              subscores: {
                affordability: 95,
                accessibility: 20,
                safety: 30,
                commute: 25,
                inclusivity: 20
              }
            },
            {
              id: '8',
              title: 'Premium Penthouse',
              addr: '500 Luxury Ave, Blacksburg, VA',
              rent: 3500,
              avg_utils: 400,
              deposit: 3500,
              bedrooms: 4,
              bathrooms: 3,
              step_free: true,
              elevator: true,
              doorway_width_cm: 100,
              acc_bath: true,
              acc_parking: true,
              well_lit: true,
              dist_to_campus_km: 0.3,
              walk_min: 5,
              bus_headway_min: 5,
              accepts_international: true,
              no_ssn_ok: true,
              cosigner_ok: true,
              anti_disc_policy: true,
              di_score: 95,
              subscores: {
                affordability: 60,
                accessibility: 100,
                safety: 100,
                commute: 100,
                inclusivity: 100
              }
            }
          ]
          setListings(mockListings)
          setFilteredListings(mockListings)
        }
      } catch (err) {
        console.error('Failed to fetch listings:', err)
        setError('Failed to load listings')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {filteredListings.length} places to stay
            </h1>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Show map
              </Button>
            </div>
          </div>
        </div>
        
        <FilterBar onFiltersChange={handleFiltersChange} currentFilters={filters} />
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.id}`}>
              <ListingCard listing={listing} />
            </Link>
          ))}
        </div>
        
        {filteredListings.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            <Button 
              onClick={() => handleFiltersChange({})} 
              variant="outline" 
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}