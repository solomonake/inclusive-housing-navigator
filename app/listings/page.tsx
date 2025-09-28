'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListingCard } from '@/components/ui/ListingCard'
import { AriaLive } from '@/components/accessibility/aria-live'
import { 
  Search, 
  Filter, 
  MapPin, 
  SlidersHorizontal,
  X,
  RefreshCw,
  Map,
  Building2
} from 'lucide-react'
import { Listing } from '@/types'
import { cn } from '@/lib/cn'
import { MapView } from '@/components/listings/MapView'

// Filter rail component with API integration
const FilterRail: React.FC<{
  onFiltersChange: (filters: any) => void
  loading: boolean
}> = ({ onFiltersChange, loading }) => {
  const [priceRange, setPriceRange] = useState([500, 2000])
  const [bedrooms, setBedrooms] = useState('any')
  const [accessibilityMin, setAccessibilityMin] = useState(70)
  const [inclusivityMin, setInclusivityMin] = useState(60)
  const [safetyMin, setSafetyMin] = useState(80)
  const [commuteMax, setCommuteMax] = useState(30)

  const applyFilters = () => {
    const filters = {
      maxRent: priceRange[1],
      minScore: Math.min(accessibilityMin, inclusivityMin, safetyMin),
      accessibility: accessibilityMin > 0,
      bedrooms: bedrooms !== 'any' ? parseInt(bedrooms) : undefined,
    }
    onFiltersChange(filters)
  }

  const clearFilters = () => {
    setPriceRange([500, 2000])
    setBedrooms('any')
    setAccessibilityMin(70)
    setInclusivityMin(60)
    setSafetyMin(80)
    setCommuteMax(30)
    onFiltersChange({})
  }

  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
          Filters
        </CardTitle>
        <CardDescription>
          Refine your search to find the perfect home
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">
            Monthly Rent: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <div className="flex gap-2">
            <input
              type="range"
              min="300"
              max="3000"
              step="50"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="flex-1 focus-ring"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min="300"
              max="3000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 focus-ring"
              aria-label="Maximum price"
            />
          </div>
          <p className="text-xs text-white/60">
            Adjust the range to filter by monthly rent
          </p>
        </div>

        {/* Bedrooms */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">
            Bedrooms
          </label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full p-3 border border-white/20 rounded-xl bg-white/10 text-white focus-ring backdrop-blur-md"
            aria-label="Number of bedrooms"
          >
            <option value="any">Any</option>
            <option value="1">1 bedroom</option>
            <option value="2">2 bedrooms</option>
            <option value="3">3 bedrooms</option>
            <option value="4+">4+ bedrooms</option>
          </select>
        </div>

        {/* Accessibility Score */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">
            Min Accessibility: {accessibilityMin}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={accessibilityMin}
            onChange={(e) => setAccessibilityMin(parseInt(e.target.value))}
            className="w-full focus-ring"
            aria-label="Minimum accessibility score"
          />
          <p className="text-xs text-white/60">
            Higher scores mean better accessibility features
          </p>
        </div>

        {/* Inclusivity Score */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">
            Min Inclusivity: {inclusivityMin}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={inclusivityMin}
            onChange={(e) => setInclusivityMin(parseInt(e.target.value))}
            className="w-full focus-ring"
            aria-label="Minimum inclusivity score"
          />
        </div>

        {/* Safety Score */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">
            Min Safety: {safetyMin}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={safetyMin}
            onChange={(e) => setSafetyMin(parseInt(e.target.value))}
            className="w-full focus-ring"
            aria-label="Minimum safety score"
          />
        </div>

        {/* Commute Time */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">
            Max Commute: {commuteMax} minutes
          </label>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={commuteMax}
            onChange={(e) => setCommuteMax(parseInt(e.target.value))}
            className="w-full focus-ring"
            aria-label="Maximum commute time"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="gradient"
            className="flex-1"
            onClick={applyFilters}
            disabled={loading}
          >
            <Search className="w-4 h-4 mr-2" aria-hidden="true" />
            Apply
          </Button>
          <Button 
            variant="glass"
            onClick={clearFilters}
            disabled={loading}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [filtersRelaxed, setFiltersRelaxed] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<any>({})
  const [selectedListing, setSelectedListing] = useState<Listing | undefined>()
  const [ariaMessage, setAriaMessage] = useState('')

  const fetchListings = async (filters: any = {}) => {
    try {
      setLoading(true)
      setError(null)
      setAriaMessage('Loading listings...')
      
      const queryParams = new URLSearchParams()
      if (filters.maxRent) queryParams.append('max_rent', filters.maxRent.toString())
      if (filters.minScore) queryParams.append('min_score', filters.minScore.toString())
      if (filters.accessibility) queryParams.append('accessibility', 'true')
      
      const response = await fetch(`/api/listings?${queryParams.toString()}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        setAriaMessage(`Error: ${data.error}`)
    } else {
        setListings(data.listings || [])
        setFiltersRelaxed(data.meta?.relaxed || false)
        setAriaMessage(`Found ${data.listings?.length || 0} listings`)
      }
    } catch (err) {
      setError('Failed to fetch listings')
      setAriaMessage('Failed to fetch listings')
      console.error('Error fetching listings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters)
    fetchListings(filters)
  }

  const handleListingAction = (action: string, listing: Listing) => {
    console.log(`${action} clicked for listing:`, listing.id)
    // Implement action handlers here
  }

  if (loading) {
    return (
      <div className="section bg-radial bg-grid">
        <div className="container-page">
          <AriaLive message="Loading listings..." />
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
            <div className="space-y-4">
              <div className="skeleton h-96 rounded-2xl"></div>
            </div>
            <div className="space-y-4">
              <div className="skeleton h-20 rounded-2xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-80 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section bg-radial bg-grid">
        <div className="container-page">
          <AriaLive message={`Error: ${error}`} assertive />
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Error Loading Listings</h2>
              <p className="text-white/70 mb-6">{error}</p>
              <Button variant="gradient" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="section bg-radial bg-grid">
      <div className="container-page">
        <AriaLive message={ariaMessage} />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white text-shadow mb-2">
                Housing Listings
              </h1>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Discover inclusive, accessible housing with AI-powered D&I scoring
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
          {/* Filter Rail */}
          <div>
            <FilterRail onFiltersChange={handleFiltersChange} loading={loading} />
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {listings.length} {listings.length === 1 ? 'Property' : 'Properties'} Found
                </h2>
                {filtersRelaxed && (
                  <Badge className="mt-2 bg-amber-500/20 text-amber-300 border-amber-500/30">
                    Filters relaxed to show more results
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showMap ? "gradient" : "glass"}
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2"
                >
                  <Map className="w-4 h-4" aria-hidden="true" />
                  {showMap ? 'Hide' : 'Show'} Map
                </Button>
              </div>
            </div>

            {/* Map Panel (when shown) */}
            {showMap && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                    Property Locations
                  </CardTitle>
                  <CardDescription>
                    Interactive map showing all available properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapView 
                    listings={listings}
                    selectedListing={selectedListing}
                    onListingSelect={setSelectedListing}
                  />
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {listings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Properties Found</h3>
                  <p className="text-white/70 mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <Button variant="glass" onClick={clearFilters}>
                    <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                    onSave={(listing) => handleListingAction('save', listing)}
                    onCompare={(listing) => handleListingAction('compare', listing)}
                    onDetails={(listing) => handleListingAction('details', listing)}
                    onLeaseQA={(listing) => handleListingAction('lease-qa', listing)}
                />
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}