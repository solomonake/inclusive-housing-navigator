'use client';

import React, { useState } from 'react';

interface CulturalTipsProps {
  className?: string;
}

interface Tip {
  id: number;
  category: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  completed: boolean;
}

export const CulturalTips: React.FC<CulturalTipsProps> = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedTips, setCompletedTips] = useState<number[]>([]);

  const tips: Tip[] = [
    {
      id: 1,
      category: 'housing',
      title: 'Understanding US Rental Terms',
      description: 'Learn about security deposits, first/last month rent, application fees, and lease terms commonly used in the US.',
      icon: '🏠',
      difficulty: 'Easy',
      estimatedTime: '15 min',
      completed: false
    },
    {
      id: 2,
      category: 'housing',
      title: 'Roommate Culture & Expectations',
      description: 'Understand American roommate culture, shared responsibilities, and communication norms.',
      icon: '👥',
      difficulty: 'Medium',
      estimatedTime: '30 min',
      completed: false
    },
    {
      id: 3,
      category: 'financial',
      title: 'Building Credit History',
      description: 'Learn how to build credit history in the US, including secured credit cards and co-signer options.',
      icon: '💳',
      difficulty: 'Hard',
      estimatedTime: '45 min',
      completed: false
    },
    {
      id: 4,
      category: 'financial',
      title: 'Banking & Payment Methods',
      description: 'Understand US banking system, checking accounts, debit cards, and online payment methods.',
      icon: '🏦',
      difficulty: 'Medium',
      estimatedTime: '25 min',
      completed: false
    },
    {
      id: 5,
      category: 'transportation',
      title: 'Public Transportation',
      description: 'Learn about bus systems, metro cards, ride-sharing apps, and transportation etiquette.',
      icon: '🚌',
      difficulty: 'Easy',
      estimatedTime: '20 min',
      completed: false
    },
    {
      id: 6,
      category: 'transportation',
      title: 'Walking & Safety',
      description: 'Understand walking safety, street layouts, and cultural norms around pedestrian behavior.',
      icon: '🚶',
      difficulty: 'Easy',
      estimatedTime: '15 min',
      completed: false
    },
    {
      id: 7,
      category: 'communication',
      title: 'Email & Phone Etiquette',
      description: 'Learn proper email formatting, phone call etiquette, and professional communication styles.',
      icon: '📧',
      difficulty: 'Easy',
      estimatedTime: '20 min',
      completed: false
    },
    {
      id: 8,
      category: 'communication',
      title: 'Landlord Communication',
      description: 'Understand how to communicate with landlords, maintenance requests, and lease negotiations.',
      icon: '🤝',
      difficulty: 'Medium',
      estimatedTime: '30 min',
      completed: false
    },
    {
      id: 9,
      category: 'legal',
      title: 'Rental Rights & Laws',
      description: 'Learn about tenant rights, fair housing laws, and what to do in case of disputes.',
      icon: '⚖️',
      difficulty: 'Hard',
      estimatedTime: '60 min',
      completed: false
    },
    {
      id: 10,
      category: 'legal',
      title: 'Documentation Requirements',
      description: 'Understand required documents for rental applications, including visa status and financial proof.',
      icon: '📄',
      difficulty: 'Medium',
      estimatedTime: '25 min',
      completed: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tips', icon: '🌟' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'financial', name: 'Financial', icon: '💰' },
    { id: 'transportation', name: 'Transportation', icon: '🚌' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'legal', name: 'Legal', icon: '⚖️' }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const toggleTipCompletion = (tipId: number) => {
    setCompletedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
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

  const completedCount = completedTips.length;
  const totalCount = tips.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">🌍</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cultural Tips for International Students</h2>
            <p className="text-gray-600">Essential knowledge for navigating US housing and culture</p>
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progressPercentage === 100 
            ? "🎉 Congratulations! You've completed all cultural tips!" 
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => {
          const isCompleted = completedTips.includes(tip.id);
          return (
            <div
              key={tip.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all duration-200 cursor-pointer ${
                isCompleted
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => toggleTipCompletion(tip.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{tip.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{tip.title}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                      {tip.difficulty}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">⏱️ {tip.estimatedTime}</span>
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-medium text-gray-900">Study Guide</h4>
            <p className="text-sm text-gray-600">Download comprehensive study materials</p>
          </button>
          
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-medium text-gray-900">Practice Quiz</h4>
            <p className="text-sm text-gray-600">Test your knowledge with interactive quizzes</p>
          </button>
          
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-medium text-gray-900">Get Help</h4>
            <p className="text-sm text-gray-600">Connect with cultural mentors</p>
          </button>
        </div>
      </div>
    </div>
  );
};
