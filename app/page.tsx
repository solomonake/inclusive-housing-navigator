'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Accessibility, FileText, PieChart, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { QuickStart } from '@/components/home/QuickStart'
import { HealthStatus } from '@/components/home/HealthStatus'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2 text-sm font-medium text-[var(--fg-muted)]">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              Built at VTHacks • Inclusive by design
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--purple)] bg-clip-text text-transparent">
                Find Your Perfect Home
              </span>
              <br />
              <span className="text-[var(--fg)]">with AI-Powered Insights</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[var(--fg-muted)] max-w-2xl mx-auto leading-relaxed">
              Navigate housing with confidence using our inclusive AI copilot. Get personalized recommendations, 
              accessibility analysis, and D&I scoring tailored for international and rural students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/listings" className="flex items-center gap-2">
                  Start Your Profile
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

            {/* Integration Status */}
            <div className="max-w-4xl mx-auto mb-8">
              <HealthStatus />
            </div>

            {/* Stats or additional info could go here */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-[var(--border)]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary)]">500+</div>
                <div className="text-sm text-[var(--fg-muted)]">Housing Options</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--success)]">95%</div>
                <div className="text-sm text-[var(--fg-muted)]">Accessibility Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--warning)]">24/7</div>
                <div className="text-sm text-[var(--fg-muted)]">AI Support</div>
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
              <h2 className="text-3xl font-bold text-[var(--fg)] mb-4">
                Find Your Perfect Home in Minutes
              </h2>
              <p className="text-lg text-[var(--fg-muted)]">
                Get personalized housing recommendations based on your budget and needs
              </p>
            </div>
            <QuickStart />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-[var(--surface)]">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--fg)] mb-4">
              Everything You Need to Find Inclusive Housing
            </h2>
            <p className="text-lg text-[var(--fg-muted)] max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with accessibility-first design to help you make informed housing decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Smart Listings */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--primary)]/20 transition-colors">
                  <Building2 className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Smart Listings</CardTitle>
                <CardDescription>
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
                <div className="w-12 h-12 bg-[var(--success)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--success)]/20 transition-colors">
                  <Accessibility className="w-6 h-6 text-[var(--success)]" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Accessibility Analysis</CardTitle>
                <CardDescription>
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
                <div className="w-12 h-12 bg-[var(--warning)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--warning)]/20 transition-colors">
                  <FileText className="w-6 h-6 text-[var(--warning)]" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Lease Analysis</CardTitle>
                <CardDescription>
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
                <div className="w-12 h-12 bg-[var(--info)]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--info)]/20 transition-colors">
                  <PieChart className="w-6 h-6 text-[var(--info)]" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Data Insights</CardTitle>
                <CardDescription>
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

      {/* Call to Action Section */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-[var(--primary)]/5 to-[var(--purple)]/5 border-[var(--primary)]/20">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold text-[var(--fg)] mb-4">
                  Ready to Find Your Perfect Home?
                </h3>
                <p className="text-[var(--fg-muted)] mb-8">
                  Join thousands of students who have found inclusive, accessible housing with our AI-powered platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/listings">Get Started Today</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
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