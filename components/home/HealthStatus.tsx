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
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-600 dark:text-gray-400">Integration Status:</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              health.hasGemini ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={health.hasGemini ? 'Gemini API connected' : 'Gemini API not configured'}
          ></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Gemini</span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              health.hasDatabricks ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={health.hasDatabricks ? 'Databricks connected' : 'Databricks not configured'}
          ></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Databricks</span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              health.hasMapbox ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={health.hasMapbox ? 'Mapbox connected' : 'Mapbox not configured'}
          ></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Mapbox</span>
        </div>
      </div>
    </div>
  );
};
