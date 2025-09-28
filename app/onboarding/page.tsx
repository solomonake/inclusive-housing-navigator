'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  Accessibility, 
  Shield, 
  Globe, 
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface UserPreferences {
  budget: number
  max_rent: number
  bedrooms: number
  bathrooms: number
  accessibility_needs: string[]
  commute_preferences: {
    max_walk_time: number
    max_bus_time: number
    car_required: boolean
  }
  inclusivity_needs: {
    international_student: boolean
    language_preference: string
    cultural_considerations: string[]
  }
  location_preferences: {
    max_distance_campus: number
    preferred_neighborhoods: string[]
    safety_priority: 'high' | 'medium' | 'low'
  }
}

const accessibilityOptions = [
  { id: 'step_free', label: 'Step-free entry', description: 'No stairs to enter the building' },
  { id: 'elevator', label: 'Elevator access', description: 'Elevator available for upper floors' },
  { id: 'wide_doorways', label: 'Wide doorways', description: 'Doorways at least 32 inches wide' },
  { id: 'accessible_bathroom', label: 'Accessible bathroom', description: 'Bathroom with grab bars and wide entry' },
  { id: 'accessible_parking', label: 'Accessible parking', description: 'Designated accessible parking spaces' },
  { id: 'visual_impairment', label: 'Visual impairment support', description: 'Tactile indicators and audio announcements' },
  { id: 'hearing_impairment', label: 'Hearing impairment support', description: 'Visual fire alarms and doorbells' }
]

const culturalConsiderations = [
  'Halal food options nearby',
  'Vegetarian/vegan friendly',
  'Cultural community centers',
  'Religious facilities nearby',
  'Language support services',
  'Cultural events and activities'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 2000,
    max_rent: 1600,
    bedrooms: 1,
    bathrooms: 1,
    accessibility_needs: [],
    commute_preferences: {
      max_walk_time: 20,
      max_bus_time: 30,
      car_required: false
    },
    inclusivity_needs: {
      international_student: false,
      language_preference: 'en',
      cultural_considerations: []
    },
    location_preferences: {
      max_distance_campus: 2.0,
      preferred_neighborhoods: [],
      safety_priority: 'high'
    }
  })

  const totalSteps = 5

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save preferences and redirect to listings
      localStorage.setItem('userPreferences', JSON.stringify(preferences))
      router.push('/listings')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const toggleAccessibilityNeed = (needId: string) => {
    setPreferences(prev => ({
      ...prev,
      accessibility_needs: prev.accessibility_needs.includes(needId)
        ? prev.accessibility_needs.filter(id => id !== needId)
        : [...prev.accessibility_needs, needId]
    }))
  }

  const toggleCulturalConsideration = (consideration: string) => {
    setPreferences(prev => ({
      ...prev,
      inclusivity_needs: {
        ...prev.inclusivity_needs,
        cultural_considerations: prev.inclusivity_needs.cultural_considerations.includes(consideration)
          ? prev.inclusivity_needs.cultural_considerations.filter(c => c !== consideration)
          : [...prev.inclusivity_needs.cultural_considerations, consideration]
      }
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Inclusive Housing Navigator</h2>
              <p className="text-gray-600">Let's find your perfect home! We'll ask a few questions to personalize your search.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget ($)
                </label>
                <input
                  type="number"
                  value={preferences.budget}
                  onChange={(e) => {
                    const budget = Number(e.target.value)
                    updatePreferences({ 
                      budget,
                      max_rent: Math.round(budget * 0.8) // 80% of budget for rent
                    })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="500"
                  max="10000"
                  step="100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll set your max rent to ${preferences.max_rent} (80% of budget)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={preferences.bedrooms}
                    onChange={(e) => updatePreferences({ bedrooms: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1 Bedroom</option>
                    <option value={2}>2 Bedrooms</option>
                    <option value={3}>3 Bedrooms</option>
                    <option value={4}>4+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <select
                    value={preferences.bathrooms}
                    onChange={(e) => updatePreferences({ bathrooms: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1 Bathroom</option>
                    <option value={2}>2 Bathrooms</option>
                    <option value={3}>3+ Bathrooms</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accessibility Needs</h2>
              <p className="text-gray-600">Select any accessibility features that are important to you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessibilityOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    preferences.accessibility_needs.includes(option.id)
                      ? 'ring-2 ring-indigo-500 bg-indigo-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleAccessibilityNeed(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={preferences.accessibility_needs.includes(option.id)}
                        onChange={() => toggleAccessibilityNeed(option.id)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Commute Preferences</h2>
              <p className="text-gray-600">How do you prefer to get around?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum walking time to campus (minutes)
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={preferences.commute_preferences.max_walk_time}
                  onChange={(e) => updatePreferences({
                    commute_preferences: {
                      ...preferences.commute_preferences,
                      max_walk_time: Number(e.target.value)
                    }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5 min</span>
                  <span className="font-medium">{preferences.commute_preferences.max_walk_time} min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum bus time to campus (minutes)
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={preferences.commute_preferences.max_bus_time}
                  onChange={(e) => updatePreferences({
                    commute_preferences: {
                      ...preferences.commute_preferences,
                      max_bus_time: Number(e.target.value)
                    }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>10 min</span>
                  <span className="font-medium">{preferences.commute_preferences.max_bus_time} min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="car_required"
                  checked={preferences.commute_preferences.car_required}
                  onChange={(e) => updatePreferences({
                    commute_preferences: {
                      ...preferences.commute_preferences,
                      car_required: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="car_required" className="ml-2 text-sm text-gray-700">
                  I have a car and need parking
                </label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Inclusivity & Cultural Needs</h2>
              <p className="text-gray-600">Help us find housing that supports your unique needs.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="international_student"
                  checked={preferences.inclusivity_needs.international_student}
                  onChange={(e) => updatePreferences({
                    inclusivity_needs: {
                      ...preferences.inclusivity_needs,
                      international_student: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="international_student" className="ml-2 text-sm text-gray-700">
                  I am an international student
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  value={preferences.inclusivity_needs.language_preference}
                  onChange={(e) => updatePreferences({
                    inclusivity_needs: {
                      ...preferences.inclusivity_needs,
                      language_preference: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ar">Arabic</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Considerations (select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {culturalConsiderations.map((consideration) => (
                    <label key={consideration} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.inclusivity_needs.cultural_considerations.includes(consideration)}
                        onChange={() => toggleCulturalConsideration(consideration)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{consideration}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Safety</h2>
              <p className="text-gray-600">Final preferences for your ideal location.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum distance from campus (km)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={preferences.location_preferences.max_distance_campus}
                  onChange={(e) => updatePreferences({
                    location_preferences: {
                      ...preferences.location_preferences,
                      max_distance_campus: Number(e.target.value)
                    }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0.5 km</span>
                  <span className="font-medium">{preferences.location_preferences.max_distance_campus} km</span>
                  <span>10 km</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Safety Priority
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'high', label: 'High', description: 'Safety is my top priority' },
                    { value: 'medium', label: 'Medium', description: 'Important but not critical' },
                    { value: 'low', label: 'Low', description: 'Other factors more important' }
                  ].map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        preferences.location_preferences.safety_priority === option.value
                          ? 'ring-2 ring-indigo-500 bg-indigo-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => updatePreferences({
                        location_preferences: {
                          ...preferences.location_preferences,
                          safety_priority: option.value as 'high' | 'medium' | 'low'
                        }
                      })}
                    >
                      <CardContent className="p-4 text-center">
                        <h3 className="font-medium text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'Find My Home' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Skip Option */}
        {currentStep < totalSteps && (
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/listings')}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip and browse all listings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
