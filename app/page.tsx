import Link from "next/link";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Building2, Accessibility, FileText, PieChart, Sparkles } from "lucide-react";
import { QuickStart } from "@/components/home/QuickStart";
import { CompareBar } from "@/components/ui/CompareBar";

export default function HomePage() {
  return (
    <>
      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Theme OK Demo Block */}
      <div className="bg-indigo-600 text-white px-3 py-1 inline-block rounded">
        Theme OK
      </div>
      
      {/* Hero Section */}
      <div className="text-center space-y-8">
        {/* VTHacks Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Built at VTHacks • Inclusive by design
        </div>

        {/* Headlines */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Find Your Perfect
            <span className="block text-blue-600">Inclusive Home</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI-powered housing copilot for international & rural students with transparent D&I scoring, 
            accessibility analysis, and inclusive design principles.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/listings"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start housing profile
          </Link>
          <Link 
            href="/lease"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Analyze a lease
          </Link>
        </div>
      </div>

      {/* Core Features Grid */}
      <section className="space-y-8">
        <h2 className="sr-only">Core features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Building2 className="w-6 h-6 text-indigo-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl text-gray-900">D&I Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Transparent diversity & inclusion scoring across affordability, accessibility, safety, commute, and inclusivity metrics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <Accessibility className="w-6 h-6 text-emerald-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl text-gray-900">Accessibility Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                WCAG 2.2 AA compliant analysis of accessibility features including step-free entry, elevator access, and adaptive facilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <FileText className="w-6 h-6 text-amber-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl text-gray-900">Lease QA</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                AI-powered lease analysis with translation support, red flag detection, and plain language summaries for better understanding.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <PieChart className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl text-gray-900">Auto Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Smart charts and visualizations that automatically adapt to your data, providing insights into housing trends and patterns.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">How it works</CardTitle>
            <CardDescription className="text-base">
              Three quick steps to find your perfect inclusive housing match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[hsl(var(--accent))] text-[hsl(var(--accent-contrast))] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-[hsl(var(--fg))]">Set Your Preferences</h4>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">Tell us about your budget, accessibility needs, and lifestyle preferences.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[hsl(var(--accent))] text-[hsl(var(--accent-contrast))] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-[hsl(var(--fg))]">Get D&I Scores</h4>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">Our AI analyzes each listing for diversity, inclusion, and accessibility factors.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[hsl(var(--accent))] text-[hsl(var(--accent-contrast))] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-[hsl(var(--fg))]">Find Your Match</h4>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">Browse ranked results with detailed explanations and accessibility features.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">Why it matters</CardTitle>
            <CardDescription className="text-base">
              Built with real-world experience and inclusive design principles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[hsl(var(--fg-muted))] leading-relaxed">
              Inspired by experiences from rural Uganda and Nepal, we understand the unique challenges 
              international and rural students face when searching for housing. Many struggle with 
              accessibility barriers, language barriers, and hidden discrimination.
            </p>
            <p className="text-[hsl(var(--fg-muted))] leading-relaxed">
              Our platform addresses these issues through transparent scoring, multilingual support, 
              and comprehensive accessibility analysis, ensuring every student can find a safe, 
              welcoming home.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">Ready?</CardTitle>
            <CardDescription className="text-base">
              Start your inclusive housing journey today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[hsl(var(--fg-muted))]">
              Join thousands of students who have found their perfect housing match through our 
              inclusive platform. Get started in minutes and discover housing options that truly 
              welcome you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/listings"
                className="inline-flex items-center justify-center px-6 py-3 bg-[hsl(var(--accent))] text-[hsl(var(--accent-contrast))] font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:ring-offset-2 text-center"
              >
                Browse Listings
              </Link>
              <Link 
                href="/lease"
                className="inline-flex items-center justify-center px-6 py-3 border border-[hsl(var(--accent))] text-[hsl(var(--accent))] font-semibold rounded-lg hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-contrast))] transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:ring-offset-2 text-center"
              >
                Analyze Lease
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Start Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Try it now</h2>
        <QuickStart />
      </section>
      </main>

      {/* Compare Bar - Site-wide sticky bottom bar */}
      <CompareBar />
    </>
  );
}