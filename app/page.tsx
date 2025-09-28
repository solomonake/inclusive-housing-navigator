'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Accessibility, FileText, PieChart, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { QuickStart } from '@/components/home/QuickStart'
import { HealthStatus } from '@/components/home/HealthStatus'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-radial bg-grid">
      {/* Hero Section */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium text-white/80">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Built at VTHacks • Inclusive by design
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Find Your Perfect Home
              </span>
              <br />
              <span className="text-white text-shadow">with AI-Powered Insights</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Navigate housing with confidence using our inclusive AI copilot. Get personalized recommendations, 
              accessibility analysis, and D&I scoring tailored for international and rural students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="gradient" size="lg" className="w-full sm:w-auto">
                <Link href="/listings" className="flex items-center gap-2">
                  Start Your Profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg" className="w-full sm:w-auto">
                <Link href="/lease" className="flex items-center gap-2">
                  Analyze Lease
                  <FileText className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Integration Status */}
            <div className="max-w-4xl mx-auto mb-8">
              <HealthStatus />
            </div>

            {/* Stats or additional info could go here */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-[var(--border)]">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">500+</div>
                <div className="text-sm text-white/60">Housing Options</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">95%</div>
                <div className="text-sm text-white/60">Accessibility Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">24/7</div>
                <div className="text-sm text-white/60">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white text-shadow mb-4">
                Find Your Perfect Home in Minutes
              </h2>
              <p className="text-lg text-white/70">
                Get personalized housing recommendations based on your budget and needs
              </p>
            </div>
            <QuickStart />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white text-shadow mb-4">
              Everything You Need to Find Inclusive Housing
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with accessibility-first design to help you make informed housing decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Smart Listings */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                  <Building2 className="w-6 h-6 text-indigo-400" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Smart Listings</CardTitle>
                <CardDescription>
                  Discover housing options with AI-powered filtering and personalized recommendations based on your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="glass" className="w-full">
                  <Link href="/listings">Explore Listings</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Accessibility Analysis */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  <Accessibility className="w-6 h-6 text-emerald-400" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Accessibility Analysis</CardTitle>
                <CardDescription>
                  Get detailed accessibility scores and insights for every property, ensuring your needs are met.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="glass" className="w-full">
                  <Link href="/listings?filter=accessibility">View Scores</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Lease Analysis */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                  <FileText className="w-6 h-6 text-amber-400" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Lease Analysis</CardTitle>
                <CardDescription>
                  Upload your lease documents for AI-powered analysis of terms, risks, and key considerations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="glass" className="w-full">
                  <Link href="/lease">Analyze Lease</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Data Insights */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500/30 transition-colors">
                  <PieChart className="w-6 h-6 text-sky-400" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Data Insights</CardTitle>
                <CardDescription>
                  Explore housing trends, diversity metrics, and market insights with interactive visualizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="glass" className="w-full">
                  <Link href="/charts">View Charts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Find Your Perfect Home?
                </h3>
                <p className="text-white/70 mb-8">
                  Join thousands of students who have found inclusive, accessible housing with our AI-powered platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="gradient" size="lg">
                    <Link href="/listings">Get Started Today</Link>
                  </Button>
                  <Button asChild variant="glass" size="lg">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}