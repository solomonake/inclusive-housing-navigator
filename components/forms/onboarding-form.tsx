'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { AriaLive } from '@/components/accessibility/aria-live';

interface OnboardingFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  className?: string;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ 
  onSubmit, 
  className 
}) => {
  const [step, setStep] = useState(1);
  const [announcement, setAnnouncement] = useState('');
  const [formData, setFormData] = useState<Partial<UserPreferences>>({
    budget: 2000,
    max_rent: 1500,
    bedrooms: 1,
    bathrooms: 1,
    accessibility_needs: [],
    commute_preferences: {
      max_walk_time: 20,
      max_bus_frequency: 15,
      winter_penalty: false
    },
    inclusivity_needs: {
      international_student: false,
      no_ssn: false,
      needs_cosigner: false
    },
    language: 'en',
    pet_friendly: false,
    smoking_allowed: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof UserPreferences],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setAnnouncement(`Step ${step + 1} of 4`);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setAnnouncement(`Step ${step - 1} of 4`);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData as UserPreferences);
    setAnnouncement('Preferences saved successfully');
  };

  const accessibilityOptions = [
    'Wheelchair accessible',
    'Visual accessibility',
    'Hearing accessibility',
    'Cognitive accessibility',
    'Mobility assistance'
  ];

  return (
    <div className={cn('max-w-2xl mx-auto p-6', className)}>
      <AriaLive message={announcement} />
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Inclusive Housing Navigator</CardTitle>
          <CardDescription>
            Let's personalize your housing search with your preferences and needs.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FocusTrap active={true}>
            <div className="space-y-6">
              {/* Step 1: Budget and Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Budget & Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium mb-2">
                        Monthly Budget
                      </label>
                      <input
                        id="budget"
                        type="number"
                        value={formData.budget || ''}
                        onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-describedby="budget-help"
                      />
                      <p id="budget-help" className="text-sm text-gray-600 mt-1">
                        Your total monthly housing budget
                      </p>
                    </div>

                    <div>
                      <label htmlFor="max_rent" className="block text-sm font-medium mb-2">
                        Maximum Rent
                      </label>
                      <input
                        id="max_rent"
                        type="number"
                        value={formData.max_rent || ''}
                        onChange={(e) => handleInputChange('max_rent', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-describedby="max_rent-help"
                      />
                      <p id="max_rent-help" className="text-sm text-gray-600 mt-1">
                        Maximum rent you're willing to pay
                      </p>
                    </div>

                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium mb-2">
                        Bedrooms
                      </label>
                      <select
                        id="bedrooms"
                        value={formData.bedrooms || 1}
                        onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 bedroom</option>
                        <option value={2}>2 bedrooms</option>
                        <option value={3}>3 bedrooms</option>
                        <option value={4}>4+ bedrooms</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium mb-2">
                        Bathrooms
                      </label>
                      <select
                        id="bathrooms"
                        value={formData.bathrooms || 1}
                        onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 bathroom</option>
                        <option value={1.5}>1.5 bathrooms</option>
                        <option value={2}>2 bathrooms</option>
                        <option value={2.5}>2.5 bathrooms</option>
                        <option value={3}>3+ bathrooms</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Accessibility Needs */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Accessibility Needs</h3>
                  <p className="text-sm text-gray-600">
                    Select any accessibility features that are important to you:
                  </p>
                  
                  <div className="space-y-2">
                    {accessibilityOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.accessibility_needs?.includes(option) || false}
                          onChange={(e) => {
                            const current = formData.accessibility_needs || [];
                            const updated = e.target.checked
                              ? [...current, option]
                              : current.filter(item => item !== option);
                            handleInputChange('accessibility_needs', updated);
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Commute Preferences */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Commute Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="max_walk_time" className="block text-sm font-medium mb-2">
                        Maximum Walk Time (minutes)
                      </label>
                      <input
                        id="max_walk_time"
                        type="number"
                        value={formData.commute_preferences?.max_walk_time || 20}
                        onChange={(e) => handleNestedInputChange('commute_preferences', 'max_walk_time', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="max_bus_frequency" className="block text-sm font-medium mb-2">
                        Maximum Bus Wait Time (minutes)
                      </label>
                      <input
                        id="max_bus_frequency"
                        type="number"
                        value={formData.commute_preferences?.max_bus_frequency || 15}
                        onChange={(e) => handleNestedInputChange('commute_preferences', 'max_bus_frequency', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.commute_preferences?.winter_penalty || false}
                          onChange={(e) => handleNestedInputChange('commute_preferences', 'winter_penalty', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Apply winter conditions penalty</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Inclusivity & Final Preferences */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inclusivity & Final Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Student Status</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.inclusivity_needs?.international_student || false}
                            onChange={(e) => handleNestedInputChange('inclusivity_needs', 'international_student', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">International student</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.inclusivity_needs?.no_ssn || false}
                            onChange={(e) => handleNestedInputChange('inclusivity_needs', 'no_ssn', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">No SSN available</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.inclusivity_needs?.needs_cosigner || false}
                            onChange={(e) => handleNestedInputChange('inclusivity_needs', 'needs_cosigner', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Need cosigner</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium mb-2">
                        Preferred Language
                      </label>
                      <select
                        id="language"
                        value={formData.language || 'en'}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Additional Preferences</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.pet_friendly || false}
                            onChange={(e) => handleInputChange('pet_friendly', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Pet-friendly required</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.smoking_allowed || false}
                            onChange={(e) => handleInputChange('smoking_allowed', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Smoking allowed</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  aria-label="Previous step"
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <div
                      key={stepNum}
                      className={cn(
                        'w-3 h-3 rounded-full',
                        stepNum <= step ? 'bg-blue-500' : 'bg-gray-300'
                      )}
                      aria-label={`Step ${stepNum}`}
                    />
                  ))}
                </div>

                {step < 4 ? (
                  <Button onClick={nextStep} aria-label="Next step">
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} aria-label="Complete setup">
                    Complete Setup
                  </Button>
                )}
              </div>
            </div>
          </FocusTrap>
        </CardContent>
      </Card>
    </div>
  );
};
