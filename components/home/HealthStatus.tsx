'use client';

import React, { useState, useEffect } from 'react';

interface HealthStatusProps {}

interface HealthData {
  hasGemini: boolean;
  hasDatabricks: boolean;
  hasMapbox: boolean;
}

export const HealthStatus: React.FC<HealthStatusProps> = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
        }
      } catch (error) {
        console.error('Failed to fetch health status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <span>Checking integrations...</span>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span>Integration status unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <div 
          className={`w-3 h-3 rounded-full ${
            health.hasGemini ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={health.hasGemini ? 'Gemini API connected' : 'Gemini API not configured'}
        ></div>
        <div 
          className={`w-3 h-3 rounded-full ${
            health.hasDatabricks ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={health.hasDatabricks ? 'Databricks connected' : 'Databricks not configured'}
        ></div>
        <div 
          className={`w-3 h-3 rounded-full ${
            health.hasMapbox ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={health.hasMapbox ? 'Mapbox connected' : 'Mapbox not configured'}
        ></div>
      </div>
    </div>
  );
};
