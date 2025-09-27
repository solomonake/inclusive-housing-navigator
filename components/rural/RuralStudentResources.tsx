'use client';

import React, { useState } from 'react';

interface RuralStudentResourcesProps {
  className?: string;
}

interface Resource {
  id: number;
  category: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  completed: boolean;
}

export const RuralStudentResources: React.FC<RuralStudentResourcesProps> = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedResources, setCompletedResources] = useState<number[]>([]);

  const resources: Resource[] = [
    {
      id: 1,
      category: 'transportation',
      title: 'Public Transportation Guide',
      description: 'Learn how to navigate city buses, metro systems, and ride-sharing apps. Essential for students from rural areas.',
      icon: '🚌',
      difficulty: 'Easy',
      estimatedTime: '20 min',
      completed: false
    },
    {
      id: 2,
      category: 'transportation',
      title: 'Walking & Biking Safety',
      description: 'Understand city walking patterns, bike lanes, and safety considerations for urban environments.',
      icon: '🚶',
      difficulty: 'Easy',
      estimatedTime: '15 min',
      completed: false
    },
    {
      id: 3,
      category: 'cost',
      title: 'Cost of Living Comparison',
      description: 'Compare rural vs urban costs for housing, food, transportation, and entertainment.',
      icon: '💰',
      difficulty: 'Medium',
      estimatedTime: '30 min',
      completed: false
    },
    {
      id: 4,
      category: 'cost',
      title: 'Budgeting for City Life',
      description: 'Learn to budget for higher costs in urban areas, including hidden expenses and city-specific fees.',
      icon: '📊',
      difficulty: 'Medium',
      estimatedTime: '25 min',
      completed: false
    },
    {
      id: 5,
      category: 'social',
      title: 'Making Friends in the City',
      description: 'Tips for building social connections in urban environments, including campus groups and community events.',
      icon: '👥',
      difficulty: 'Medium',
      estimatedTime: '35 min',
      completed: false
    },
    {
      id: 6,
      category: 'social',
      title: 'Cultural Adjustment',
      description: 'Navigate the transition from rural to urban culture, including social norms and expectations.',
      icon: '🌆',
      difficulty: 'Hard',
      estimatedTime: '45 min',
      completed: false
    },
    {
      id: 7,
      category: 'housing',
      title: 'Urban Housing Types',
      description: 'Understand different urban housing options: apartments, shared housing, dorms, and co-living spaces.',
      icon: '🏢',
      difficulty: 'Easy',
      estimatedTime: '20 min',
      completed: false
    },
    {
      id: 8,
      category: 'housing',
      title: 'Roommate Living',
      description: 'Learn about shared living arrangements, roommate agreements, and conflict resolution.',
      icon: '🏠',
      difficulty: 'Medium',
      estimatedTime: '30 min',
      completed: false
    },
    {
      id: 9,
      category: 'safety',
      title: 'Urban Safety Tips',
      description: 'Essential safety knowledge for city living, including personal safety and property protection.',
      icon: '🛡️',
      difficulty: 'Easy',
      estimatedTime: '25 min',
      completed: false
    },
    {
      id: 10,
      category: 'safety',
      title: 'Emergency Preparedness',
      description: 'Learn about city emergency procedures, emergency contacts, and disaster preparedness.',
      icon: '🚨',
      difficulty: 'Medium',
      estimatedTime: '30 min',
      completed: false
    },
    {
      id: 11,
      category: 'academic',
      title: 'Study Spaces & Libraries',
      description: 'Find quiet study spaces in urban environments, including campus libraries and public spaces.',
      icon: '📚',
      difficulty: 'Easy',
      estimatedTime: '15 min',
      completed: false
    },
    {
      id: 12,
      category: 'academic',
      title: 'Academic Resources',
      description: 'Access tutoring, academic support, and study groups available in urban university settings.',
      icon: '🎓',
      difficulty: 'Easy',
      estimatedTime: '20 min',
      completed: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: '🌟' },
    { id: 'transportation', name: 'Transportation', icon: '🚌' },
    { id: 'cost', name: 'Cost Management', icon: '💰' },
    { id: 'social', name: 'Social Life', icon: '👥' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'safety', name: 'Safety', icon: '🛡️' },
    { id: 'academic', name: 'Academic', icon: '📚' }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const toggleResourceCompletion = (resourceId: number) => {
    setCompletedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completedCount = completedResources.length;
  const totalCount = resources.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">🌾</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rural Student Resources</h2>
            <p className="text-gray-600">Everything you need to transition from rural to urban student life</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Your Progress</h3>
          <span className="text-sm text-gray-600">{completedCount}/{totalCount} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progressPercentage === 100 
            ? "🎉 Congratulations! You've completed all rural student resources!" 
            : `Keep going! You're ${Math.round(progressPercentage)}% complete.`
          }
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => {
          const isCompleted = completedResources.includes(resource.id);
          return (
            <div
              key={resource.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all duration-200 cursor-pointer ${
                isCompleted
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
              onClick={() => toggleResourceCompletion(resource.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{resource.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{resource.title}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">⏱️ {resource.estimatedTime}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {isCompleted && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rural Student Tips */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌾 Rural Student Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Transportation</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Download transit apps before arriving</li>
                <li>• Get a student transit pass for discounts</li>
                <li>• Learn the bus routes to campus and grocery stores</li>
                <li>• Consider a bike for short distances</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Housing</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Start looking early - urban housing fills fast</li>
                <li>• Consider shared housing to reduce costs</li>
                <li>• Visit neighborhoods at different times of day</li>
                <li>• Ask about noise levels and safety</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Social Life</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Join campus clubs and organizations</li>
                <li>• Attend orientation events and mixers</li>
                <li>• Find study groups in your major</li>
                <li>• Explore the city with new friends</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Academic Success</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Use campus libraries and study spaces</li>
                <li>• Take advantage of tutoring services</li>
                <li>• Connect with academic advisors</li>
                <li>• Join study groups for difficult classes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <div className="text-2xl mb-2">🗺️</div>
            <h4 className="font-medium text-gray-900">Campus Map</h4>
            <p className="text-sm text-gray-600">Explore campus and surrounding areas</p>
          </button>
          
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
            <div className="text-2xl mb-2">🚌</div>
            <h4 className="font-medium text-gray-900">Transit Guide</h4>
            <p className="text-sm text-gray-600">Learn public transportation routes</p>
          </button>
          
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-medium text-gray-900">Get Support</h4>
            <p className="text-sm text-gray-600">Connect with rural student mentors</p>
          </button>
        </div>
      </div>
    </div>
  );
};
