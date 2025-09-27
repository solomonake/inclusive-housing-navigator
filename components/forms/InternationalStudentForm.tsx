'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';

interface InternationalStudentFormProps {
  onSubmit: (profile: UserProfile) => void;
  onCancel: () => void;
  className?: string;
}

export const InternationalStudentForm: React.FC<InternationalStudentFormProps> = ({
  onSubmit,
  onCancel,
  className = ''
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    budget: 0,
    max_rent: 0,
    bedrooms: 1,
    bathrooms: 1,
    accessibility_needs: [],
    commute_preferences: {
      max_walk_time: 15,
      max_bus_frequency: 30,
      winter_penalty: false
    },
    inclusivity_needs: {
      international_student: true,
      no_ssn: false,
      needs_cosigner: false
    },
    language: 'en',
    pet_friendly: false,
    smoking_allowed: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.budget || formData.budget <= 0) {
        newErrors.budget = 'Please enter a valid budget';
      }
      if (!formData.max_rent || formData.max_rent <= 0) {
        newErrors.max_rent = 'Please enter a valid maximum rent';
      }
      if (formData.max_rent && formData.budget && formData.max_rent > formData.budget) {
        newErrors.max_rent = 'Maximum rent cannot exceed your budget';
      }
    }

    if (stepNumber === 2) {
      if (!formData.bedrooms || formData.bedrooms < 1) {
        newErrors.bedrooms = 'Please select at least 1 bedroom';
      }
      if (!formData.bathrooms || formData.bathrooms < 1) {
        newErrors.bathrooms = 'Please select at least 1 bathroom';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      onSubmit(formData as UserProfile);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  const accessibilityOptions = [
    { id: 'wheelchair', label: 'Wheelchair accessible', icon: '♿' },
    { id: 'elevator', label: 'Elevator access', icon: '🛗' },
    { id: 'step_free', label: 'Step-free entry', icon: '🚪' },
    { id: 'wide_doorways', label: 'Wide doorways', icon: '🚪' },
    { id: 'accessible_bathroom', label: 'Accessible bathroom', icon: '🚿' },
    { id: 'accessible_parking', label: 'Accessible parking', icon: '🅿️' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
          <span className="text-sm text-gray-500">International Student Profile</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Budget & Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget & Basic Information</h3>
            <p className="text-sm text-gray-600">Let's start with your budget and basic housing needs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Budget ($) *
              </label>
              <input
                type="number"
                value={formData.budget || ''}
                onChange={(e) => updateFormData('budget', parseInt(e.target.value) || 0)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.budget ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 1200"
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Rent ($) *
              </label>
              <input
                type="number"
                value={formData.max_rent || ''}
                onChange={(e) => updateFormData('max_rent', parseInt(e.target.value) || 0)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.max_rent ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 1000"
              />
              {errors.max_rent && <p className="text-red-500 text-sm mt-1">{errors.max_rent}</p>}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Budget Tips for International Students</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Include utilities, internet, and other monthly expenses</li>
              <li>• Consider currency exchange rates and fluctuations</li>
              <li>• Factor in security deposits (usually 1-2 months rent)</li>
              <li>• Budget for unexpected expenses and emergencies</li>
            </ul>
          </div>
        </div>
      )}

      {/* Step 2: Housing Preferences */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Housing Preferences</h3>
            <p className="text-sm text-gray-600">Tell us about your ideal living space.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <select
                value={formData.bedrooms || 1}
                onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bedrooms ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value={1}>1 Bedroom</option>
                <option value={2}>2 Bedrooms</option>
                <option value={3}>3 Bedrooms</option>
                <option value={4}>4+ Bedrooms</option>
              </select>
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <select
                value={formData.bathrooms || 1}
                onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bathrooms ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value={1}>1 Bathroom</option>
                <option value={1.5}>1.5 Bathrooms</option>
                <option value={2}>2 Bathrooms</option>
                <option value={3}>3+ Bathrooms</option>
              </select>
              {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Accessibility Needs
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accessibilityOptions.map((option) => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accessibility_needs?.includes(option.id) || false}
                    onChange={(e) => {
                      const current = formData.accessibility_needs || [];
                      const updated = e.target.checked
                        ? [...current, option.id]
                        : current.filter(id => id !== option.id);
                      updateFormData('accessibility_needs', updated);
                    }}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {option.icon} {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: International Student Specifics */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">International Student Specifics</h3>
            <p className="text-sm text-gray-600">Help us find housing that works for your unique situation.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Documentation & Support Needs
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inclusivity_needs?.no_ssn || false}
                    onChange={(e) => updateNestedFormData('inclusivity_needs', 'no_ssn', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    📄 No SSN required (I don't have a Social Security Number yet)
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inclusivity_needs?.needs_cosigner || false}
                    onChange={(e) => updateNestedFormData('inclusivity_needs', 'needs_cosigner', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    👥 Need a co-signer (I need someone to co-sign my lease)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language
              </label>
              <select
                value={formData.language || 'en'}
                onChange={(e) => updateFormData('language', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="ar">Arabic</option>
                <option value="hi">Hindi</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Commute Preferences
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Max Walk Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.commute_preferences?.max_walk_time || 15}
                    onChange={(e) => updateNestedFormData('commute_preferences', 'max_walk_time', parseInt(e.target.value) || 15)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="5"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Max Bus Wait (minutes)</label>
                  <input
                    type="number"
                    value={formData.commute_preferences?.max_bus_frequency || 30}
                    onChange={(e) => updateNestedFormData('commute_preferences', 'max_bus_frequency', parseInt(e.target.value) || 30)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="5"
                    max="60"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">🌍 International Student Support</h4>
              <p className="text-sm text-green-800">
                We understand the unique challenges international students face when finding housing. 
                Our platform prioritizes listings that are welcoming to international students and 
                provide the support you need.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-h-[44px]"
        >
          Cancel
        </button>
        
        <div className="flex space-x-3">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-h-[44px]"
            >
              Previous
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium min-h-[44px]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium min-h-[44px]"
            >
              Complete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
