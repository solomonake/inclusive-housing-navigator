'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Accessibility, FileText, PieChart, ArrowRight, Search, MapPin, Star, Heart } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Listing } from '@/types'

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])

  useEffect(() => {
    // Mock featured listings
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
      }
    ]
    setFeaturedListings(mockListings)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 rounded-full px-4 py-2 text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Built at VTHacks • Inclusive by design
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              Find Your Perfect Home
              <br />
              <span className="text-indigo-600">with AI-Powered Insights</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Navigate housing with confidence using our inclusive AI copilot. Get personalized recommendations, 
              accessibility analysis, and D&I scoring tailored for international and rural students.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-2">
                <div className="flex-1 px-4">
                  <input
                    type="text"
                    placeholder="Search by location, price, or features..."
                    className="w-full text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                <Link href="/listings" className="flex items-center gap-2">
                  Explore Listings
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/lease" className="flex items-center gap-2">
                  Analyze Lease
                  <FileText className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">
              Discover our top-rated inclusive housing options
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
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
                        // Handle like
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                    
                    {/* D&I Score badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-white/90 text-gray-900 font-semibold px-2 py-1 rounded-full text-sm">
                        {Math.round(listing.di_score || 0)}/100
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {listing.addr}
                    </p>
                    
                    <p className="text-sm text-gray-600">
                      {listing.bedrooms} bed • {listing.bathrooms} bath
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">
                          ${listing.rent}
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
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/listings">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Find Inclusive Housing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with accessibility-first design to help you make informed housing decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Smart Listings */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Building2 className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl text-gray-900">Smart Listings</CardTitle>
                <CardDescription className="text-gray-600">
                  Discover housing options with AI-powered filtering and personalized recommendations based on your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/listings">Explore Listings</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Accessibility Analysis */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Accessibility className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl text-gray-900">Accessibility Analysis</CardTitle>
                <CardDescription className="text-gray-600">
                  Get detailed accessibility scores and insights for every property, ensuring your needs are met.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/listings?filter=accessibility">View Scores</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Lease Analysis */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                  <FileText className="w-6 h-6 text-amber-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl text-gray-900">Lease Analysis</CardTitle>
                <CardDescription className="text-gray-600">
                  Upload your lease documents for AI-powered analysis of terms, risks, and key considerations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/lease">Analyze Lease</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Data Insights */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors">
                  <PieChart className="w-6 h-6 text-sky-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl text-gray-900">Data Insights</CardTitle>
                <CardDescription className="text-gray-600">
                  Explore housing trends, diversity metrics, and market insights with interactive visualizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/charts">View Charts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}