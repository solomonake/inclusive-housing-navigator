'use client';

import React, { useState } from 'react';
import { RuralStudentResources } from '@/components/rural/RuralStudentResources';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trees, BookOpen, Lightbulb, Users } from 'lucide-react';

export default function RuralStudentPage() {
  const [activeTab, setActiveTab] = useState<'resources' | 'tips' | 'community'>('resources');

  const tabs = [
    { id: 'resources', name: 'Resources', icon: BookOpen },
    { id: 'tips', name: 'Tips', icon: Lightbulb },
    { id: 'community', name: 'Community', icon: Users }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
              <Trees className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white text-shadow mb-2">
                Rural Student Resources
              </h1>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Everything you need to transition from rural to urban student life
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <Card className="p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    variant={activeTab === tab.id ? "gradient" : "glass"}
                    className="flex-1"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.name}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'resources' && (
            <RuralStudentResources />
          )}

          {activeTab === 'tips' && (
            <div className="space-y-8">
              {/* Cost Management Tips */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-white mb-4">💰 Cost Management Tips</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Card className="p-4 bg-green-500/10 border-green-500/20">
                      <h4 className="font-medium text-green-300 mb-3 text-lg">Housing Costs</h4>
                      <ul className="text-sm text-green-200 space-y-2">
                        <li>• Urban housing costs 2-3x more than rural areas</li>
                        <li>• Consider shared housing to reduce expenses</li>
                        <li>• Look for student housing discounts</li>
                        <li>• Factor in utilities, internet, and parking</li>
                      </ul>
                    </Card>
                    <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                      <h4 className="font-medium text-blue-300 mb-3 text-lg">Transportation</h4>
                      <ul className="text-sm text-blue-200 space-y-2">
                        <li>• Get a student transit pass for discounts</li>
                        <li>• Consider walking or biking for short trips</li>
                        <li>• Use ride-sharing apps sparingly</li>
                        <li>• Plan routes to minimize travel time</li>
                      </ul>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                      <h4 className="font-medium text-yellow-300 mb-3 text-lg">Food & Groceries</h4>
                      <ul className="text-sm text-yellow-200 space-y-2">
                        <li>• Cook at home to save money</li>
                        <li>• Shop at discount grocery stores</li>
                        <li>• Use student meal plans when available</li>
                        <li>• Avoid expensive convenience stores</li>
                      </ul>
                    </Card>
                    <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                      <h4 className="font-medium text-purple-300 mb-3 text-lg">Entertainment</h4>
                      <ul className="text-sm text-purple-200 space-y-2">
                        <li>• Look for student discounts on activities</li>
                        <li>• Take advantage of free campus events</li>
                        <li>• Explore parks and free attractions</li>
                        <li>• Join clubs for low-cost social activities</li>
                      </ul>
                    </Card>
                  </div>
                </div>
                </CardContent>
              </Card>

              {/* Social Transition Tips */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-white mb-4">👥 Social Transition Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Card className="p-4 bg-green-500/10 border-green-500/20">
                        <h4 className="font-medium text-green-300 mb-3 text-lg">Making Friends</h4>
                        <ul className="text-sm text-green-200 space-y-2">
                          <li>• Join campus clubs and organizations</li>
                          <li>• Attend orientation events and mixers</li>
                          <li>• Find study groups in your major</li>
                          <li>• Be open to meeting people from different backgrounds</li>
                        </ul>
                      </Card>
                      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                        <h4 className="font-medium text-blue-300 mb-3 text-lg">Cultural Adjustment</h4>
                        <ul className="text-sm text-blue-200 space-y-2">
                          <li>• Urban life moves faster than rural life</li>
                          <li>• People may seem less friendly initially</li>
                          <li>• Learn to navigate crowded spaces</li>
                          <li>• Embrace the diversity of city life</li>
                        </ul>
                      </Card>
                    </div>
                    <div className="space-y-4">
                      <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                        <h4 className="font-medium text-yellow-300 mb-3 text-lg">Staying Connected</h4>
                        <ul className="text-sm text-yellow-200 space-y-2">
                          <li>• Stay in touch with family and friends back home</li>
                          <li>• Share your experiences with others</li>
                          <li>• Find other rural students for support</li>
                          <li>• Don't be afraid to ask for help</li>
                        </ul>
                      </Card>
                      <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                        <h4 className="font-medium text-purple-300 mb-3 text-lg">Academic Success</h4>
                        <ul className="text-sm text-purple-200 space-y-2">
                          <li>• Use campus resources and support services</li>
                          <li>• Find quiet study spaces</li>
                          <li>• Connect with academic advisors</li>
                          <li>• Join study groups for difficult classes</li>
                        </ul>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              {/* Community Resources */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Community Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Campus Organizations</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Rural Student Association</li>
                        <li>• First-Generation Student Groups</li>
                        <li>• Cultural and Diversity Clubs</li>
                        <li>• Academic Support Groups</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Support Services</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Academic Advising</li>
                        <li>• Counseling Services</li>
                        <li>• Financial Aid Office</li>
                        <li>• Career Services</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Mentorship Programs</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Peer Mentorship</li>
                        <li>• Faculty Mentorship</li>
                        <li>• Alumni Networks</li>
                        <li>• Professional Mentorship</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Online Communities</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Facebook Groups</li>
                        <li>• Discord Servers</li>
                        <li>• Reddit Communities</li>
                        <li>• Campus Forums</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Stories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🌟 Success Stories</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Sarah's Journey</h4>
                    <p className="text-sm text-green-800">
                      "Coming from a small town in Iowa, I was overwhelmed by city life. But joining the Rural Student 
                      Association helped me find my community and build lasting friendships. Now I'm thriving in my 
                      urban environment!"
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Mike's Experience</h4>
                    <p className="text-sm text-blue-800">
                      "The transition from rural to urban was challenging, but the support services on campus made 
                      all the difference. I learned to navigate public transportation, found affordable housing, 
                      and even started a study group for other rural students."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Help Section */}
        <Card className="mt-12 p-8">
          <div className="text-center">
            <CardTitle className="text-2xl text-white mb-4">Need More Help?</CardTitle>
            <p className="text-white/70 mb-6 text-lg leading-relaxed">
              Our rural student support team is here to help you navigate the transition to urban student life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" className="min-h-[48px]">
                📞 Contact Support
              </Button>
              <Button variant="glass" className="min-h-[48px]">
                💬 Join Community
              </Button>
              <Button variant="glass" className="min-h-[48px]">
                📚 Resource Library
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
