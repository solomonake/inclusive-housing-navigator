'use client';

import Link from "next/link";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Accessibility, FileText, PieChart, Sparkles, ArrowRight, CheckCircle, Globe, Trees } from "lucide-react";
import { InternationalStudentForm } from "@/components/forms/InternationalStudentForm";
import { UserProfile } from "@/types";

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = (profile: UserProfile) => {
    console.log('Profile submitted:', profile);
    setShowForm(false);
    window.location.href = `/listings?profile=${encodeURIComponent(JSON.stringify(profile))}`;
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <>
      <main id="main" className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Inclusive Housing Navigator is running</span>
            </div>

            {/* VTHacks Pill */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-10">
              <Sparkles className="w-4 h-4" />
              Built at VTHacks • Inclusive by design
            </div>

            {/* Headlines */}
            <div className="space-y-8 mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="gradient-text text-shadow">
                  Find Your Perfect
                </span>
                <br />
                <span className="text-white text-shadow">
                  Inclusive Home
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed text-shadow">
                AI-powered housing copilot for international & rural students with transparent D&I scoring, 
                accessibility analysis, and inclusive design principles.
              </p>
              
              {/* Student Badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-12">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  International Students Welcome
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                  <Trees className="w-4 h-4" />
                  Rural Student Friendly
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                  <Accessibility className="w-4 h-4" />
                  Accessibility First
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16">
              <Button
                onClick={() => setShowForm(true)}
                size="xl"
                className="min-w-[200px]"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Start Housing Search
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="glass"
                size="xl"
                asChild
                className="min-w-[200px]"
              >
                <Link href="/lease">
                  <FileText className="w-5 h-5 mr-2" />
                  Analyze a Lease
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-shadow">
                Core Features
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                Everything you need to find inclusive, accessible, and affordable housing
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="group hover:scale-105 motion-safe:transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 motion-safe:transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">D&I Scoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Transparent diversity & inclusion scoring across affordability, accessibility, safety, commute, and inclusivity metrics.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:scale-105 motion-safe:transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 motion-safe:transition-transform duration-300">
                    <Accessibility className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Accessibility Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    WCAG 2.2 AA compliant analysis of accessibility features including step-free entry, elevator access, and adaptive facilities.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:scale-105 motion-safe:transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 motion-safe:transition-transform duration-300">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Lease QA</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    AI-powered lease analysis with translation support, red flag detection, and plain language summaries for better understanding.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:scale-105 motion-safe:transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 motion-safe:transition-transform duration-300">
                    <PieChart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Auto Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Smart charts and visualizations that automatically adapt to your data, providing insights into housing trends and patterns.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <Card className="hover:scale-105 motion-safe:transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">How it works</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Three quick steps to find your perfect inclusive housing match
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3 text-lg">Set Your Preferences</h4>
                      <p className="text-sm text-white/70 leading-relaxed">Tell us about your budget, accessibility needs, and lifestyle preferences.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3 text-lg">Get D&I Scores</h4>
                      <p className="text-sm text-white/70 leading-relaxed">Our AI analyzes each listing for diversity, inclusion, and accessibility factors.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3 text-lg">Find Your Match</h4>
                      <p className="text-sm text-white/70 leading-relaxed">Browse ranked results with detailed explanations and accessibility features.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 motion-safe:transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">Why it matters</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Built with real-world experience and inclusive design principles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-white/70 leading-relaxed">
                    Inspired by experiences from rural Uganda and Nepal, we understand the unique challenges 
                    international and rural students face when searching for housing. Many struggle with 
                    accessibility barriers, language barriers, and hidden discrimination.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    Our platform addresses these issues through transparent scoring, multilingual support, 
                    and comprehensive accessibility analysis, ensuring every student can find a safe, 
                    welcoming home.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 motion-safe:transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">Ready?</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Start your inclusive housing journey today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <p className="text-white/70 leading-relaxed">
                    Join thousands of students who have found their perfect housing match through our 
                    inclusive platform. Get started in minutes and discover housing options that truly 
                    welcome you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="flex-1">
                      <Link href="/listings">
                        <Building2 className="w-4 h-4 mr-2" />
                        Browse Listings
                      </Link>
                    </Button>
                    <Button variant="glass" asChild className="flex-1">
                      <Link href="/lease">
                        <FileText className="w-4 h-4 mr-2" />
                        Analyze Lease
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-shadow">
                Try it now
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Enter your preferences to find housing matches
              </p>
            </div>
            
            <Card className="p-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">Quick Start Your Search</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Get personalized housing recommendations in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Monthly Budget ($)</label>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-md"
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Max Rent ($)</label>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-md"
                      placeholder="e.g., 1000"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white">Special Considerations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-sm text-white/80">♿ Accessibility features</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-sm text-white/80">🌍 International student friendly</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-sm text-white/80">🌾 Rural student friendly</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-sm text-white/80">🚌 Near public transport</span>
                    </label>
                  </div>
                </div>
                
                <Button size="lg" className="w-full">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Find My Top Picks
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* International Student Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <InternationalStudentForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}